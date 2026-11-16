import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "Sesi login tidak ditemukan." }, 401);

    const callerClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: authData, error: authError } = await callerClient.auth.getUser(token);
    if (authError || !authData.user) return json({ error: "Sesi login tidak valid." }, 401);

    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const callerId = authData.user.id;

    const { data: profile, error: profileError } = await adminClient
      .from("wct_users")
      .select("id, role, active")
      .eq("id", callerId)
      .maybeSingle();

    if (profileError || !profile || profile.active !== true || profile.role !== "admin") {
      return json({ error: "Hanya Admin aktif yang dapat mengelola pengguna." }, 403);
    }

    const body = await req.json().catch(() => ({}));
    const action = String(body.action || "");

    if (action === "create") {
      const loginId = String(body.loginId || "").trim().toLowerCase().replace(/\s+/g, "");
      const fullName = String(body.fullName || "").trim();
      const password = String(body.password || "");
      const role = String(body.role || "member");
      const areaName = String(body.areaName || "All Areas").trim();

      if (!/^[a-z0-9._-]{3,32}$/.test(loginId)) return json({ error: "Format ID Login tidak valid." }, 400);
      if (fullName.length < 2 || fullName.length > 100) return json({ error: "Nama lengkap wajib diisi (2–100 karakter)." }, 400);
      if (password.length < 8 || password.length > 128) return json({ error: "Password harus 8–128 karakter." }, 400);
      if (!["admin", "coordinator", "member", "viewer"].includes(role)) return json({ error: "Role tidak valid." }, 400);

      const email = `${loginId}@weeklycasetracker.app`;
      const { data: created, error: createError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName, login_id: loginId },
      });
      if (createError || !created.user) {
        return json({ error: createError?.message || "Gagal membuat akun Auth." }, 400);
      }

      const userId = created.user.id;
      const { error: userError } = await adminClient.from("wct_users").insert({
        id: userId,
        login_id: loginId,
        employee_id: String(body.employeeId || loginId).trim(),
        full_name: fullName,
        area_name: areaName || "All Areas",
        role,
        active: true,
        created_by: callerId,
      });

      if (userError) {
        await adminClient.auth.admin.deleteUser(userId);
        return json({ error: userError.message }, 400);
      }

      const { error: directoryError } = await adminClient.from("wct_team_directory").upsert({
        user_id: userId,
        full_name: fullName,
        role,
        active: true,
        deleted: false,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

      if (directoryError) {
        await adminClient.from("wct_users").delete().eq("id", userId);
        await adminClient.auth.admin.deleteUser(userId);
        return json({ error: directoryError.message }, 400);
      }

      return json({ ok: true, userId, loginId: loginId.toUpperCase() });
    }

    const userId = String(body.userId || "");
    if (!userId || userId === callerId) {
      return json({ error: "Pilih akun lain yang akan dikelola." }, 400);
    }

    if (action === "set-active") {
      const active = body.active;
      if (typeof active !== "boolean") return json({ error: "Status akun tidak valid." }, 400);

      const { error: userError } = await adminClient
        .from("wct_users")
        .update({ active, updated_at: new Date().toISOString() })
        .eq("id", userId);
      if (userError) return json({ error: userError.message }, 400);

      const { error: directoryError } = await adminClient
        .from("wct_team_directory")
        .upsert({
          user_id: userId,
          full_name: String(body.fullName || ""),
          role: String(body.role || "member"),
          active,
          deleted: body.deleted === true,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
      if (directoryError) return json({ error: directoryError.message }, 400);

      return json({ ok: true });
    }

    if (action === "update-profile") {
      const fullName = String(body.fullName || "").trim();
      const role = String(body.role || "");
      const areaName = String(body.areaName || "").trim();
      if (fullName.length < 2 || fullName.length > 100) return json({ error: "Nama lengkap tidak valid." }, 400);
      if (!["admin", "coordinator", "member", "viewer"].includes(role)) return json({ error: "Role tidak valid." }, 400);

      const { error: userError } = await adminClient.from("wct_users")
        .update({ full_name: fullName, role, area_name: areaName, updated_at: new Date().toISOString() })
        .eq("id", userId);
      if (userError) return json({ error: userError.message }, 400);

      const { error: directoryError } = await adminClient.from("wct_team_directory")
        .upsert({ user_id: userId, full_name: fullName, role, active: true, deleted: false, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
      if (directoryError) return json({ error: directoryError.message }, 400);
      return json({ ok: true });
    }

    if (action === "reset-password") {
      const password = String(body.password || "");
      if (password.length < 8 || password.length > 128) return json({ error: "Password harus 8–128 karakter." }, 400);
      const { error } = await adminClient.auth.admin.updateUserById(userId, { password });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: "Aksi tidak dikenal." }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Terjadi kesalahan server." }, 500);
  }
});
