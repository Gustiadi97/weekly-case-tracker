const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

initializeApp();
const auth = getAuth();
const db = getFirestore();
const BOOTSTRAP_CODE = defineSecret('BOOTSTRAP_CODE');
const REGION = 'asia-southeast1';
const LOGIN_DOMAIN = '@weeklycasetracker.app';

function cleanLoginId(value) {
  const id = String(value || '').trim().toLowerCase().replace(/\s+/g, '');
  if (!/^[a-z0-9._-]{3,32}$/.test(id)) {
    throw new HttpsError('invalid-argument', 'ID pengguna harus 3–32 karakter: huruf, angka, titik, underscore, atau tanda hubung.');
  }
  return id;
}
function loginEmail(id) { return `${id}${LOGIN_DOMAIN}`; }
function requireSignedIn(request) {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Silakan login terlebih dahulu.');
}
function requireAdmin(request) {
  requireSignedIn(request);
  if (request.auth.token.role !== 'admin') {
    throw new HttpsError('permission-denied', 'Hanya Admin yang dapat melakukan tindakan ini.');
  }
}
function validName(value) {
  const name = String(value || '').trim();
  if (name.length < 2 || name.length > 100) throw new HttpsError('invalid-argument', 'Nama lengkap wajib diisi (2–100 karakter).');
  return name;
}
function validPassword(value) {
  const password = String(value || '');
  if (password.length < 8 || password.length > 128) throw new HttpsError('invalid-argument', 'Password harus 8–128 karakter.');
  return password;
}

exports.bootstrapFirstAdmin = onCall({ region: REGION, secrets: [BOOTSTRAP_CODE] }, async (request) => {
  requireSignedIn(request);
  const loginId = cleanLoginId(request.data?.loginId);
  const fullName = validName(request.data?.fullName);
  const setupCode = String(request.data?.setupCode || '');
  if (!setupCode || setupCode !== BOOTSTRAP_CODE.value()) {
    throw new HttpsError('permission-denied', 'Kode aktivasi Admin tidak sesuai.');
  }
  const expectedEmail = loginEmail(loginId);
  const account = await auth.getUser(request.auth.uid);
  if ((account.email || '').toLowerCase() !== expectedEmail) {
    throw new HttpsError('permission-denied', 'ID login tidak cocok dengan akun Firebase yang sedang digunakan.');
  }
  const lockRef = db.collection('_system').doc('first_admin_bootstrap');
  const userRef = db.collection('users').doc(request.auth.uid);
  await db.runTransaction(async (tx) => {
    const lock = await tx.get(lockRef);
    if (lock.exists) throw new HttpsError('failed-precondition', 'Admin pertama sudah diaktifkan.');
    const user = await tx.get(userRef);
    if (user.exists) throw new HttpsError('already-exists', 'Profil akun ini sudah tersedia.');
    tx.create(lockRef, { uid: request.auth.uid, created_at: FieldValue.serverTimestamp() });
    tx.set(userRef, {
      full_name: fullName,
      login_id: loginId.toUpperCase(),
      employee_id: loginId.toUpperCase(),
      area_name: 'All Areas',
      role: 'admin',
      active: true,
      created_at: new Date().toISOString(),
      created_by: 'bootstrap'
    });
  });
  await auth.setCustomUserClaims(request.auth.uid, { role: 'admin', loginId });
  return { ok: true };
});

exports.createTeamUser = onCall({ region: REGION }, async (request) => {
  requireAdmin(request);
  const loginId = cleanLoginId(request.data?.loginId);
  const fullName = validName(request.data?.fullName);
  const password = validPassword(request.data?.password);
  const role = String(request.data?.role || 'member');
  if (!['admin', 'coordinator', 'member', 'viewer'].includes(role)) {
    throw new HttpsError('invalid-argument', 'Role akun tidak valid.');
  }
  const areaName = String(request.data?.areaName || '').trim().slice(0, 100);
  let userRecord;
  try {
    userRecord = await auth.createUser({
      email: loginEmail(loginId),
      password,
      displayName: fullName,
      disabled: false,
      emailVerified: true
    });
    await auth.setCustomUserClaims(userRecord.uid, { role, loginId });
    await db.collection('users').doc(userRecord.uid).set({
      full_name: fullName,
      login_id: loginId.toUpperCase(),
      employee_id: loginId.toUpperCase(),
      area_name: areaName,
      role,
      active: true,
      created_at: new Date().toISOString(),
      created_by: request.auth.uid
    });
    return { uid: userRecord.uid, loginId: loginId.toUpperCase() };
  } catch (error) {
    if (userRecord?.uid) await auth.deleteUser(userRecord.uid).catch(() => {});
    if (error instanceof HttpsError) throw error;
    if (error.code === 'auth/email-already-exists') throw new HttpsError('already-exists', 'ID pengguna sudah digunakan.');
    throw new HttpsError('internal', 'Akun tidak berhasil dibuat. Periksa konfigurasi Firebase Functions.');
  }
});

exports.setTeamUserActive = onCall({ region: REGION }, async (request) => {
  requireAdmin(request);
  const uid = String(request.data?.uid || '');
  const active = request.data?.active;
  if (!uid || typeof active !== 'boolean') throw new HttpsError('invalid-argument', 'Data status akun tidak valid.');
  if (uid === request.auth.uid) throw new HttpsError('failed-precondition', 'Admin tidak dapat menonaktifkan akunnya sendiri.');
  await auth.updateUser(uid, { disabled: !active });
  await db.collection('users').doc(uid).update({ active, updated_at: new Date().toISOString() });
  if (!active) await auth.revokeRefreshTokens(uid);
  return { ok: true };
});

exports.resetTeamUserPassword = onCall({ region: REGION }, async (request) => {
  requireAdmin(request);
  const uid = String(request.data?.uid || '');
  if (!uid || uid === request.auth.uid) throw new HttpsError('invalid-argument', 'Pilih akun anggota yang akan di-reset.');
  const password = validPassword(request.data?.password);
  await auth.updateUser(uid, { password });
  await auth.revokeRefreshTokens(uid);
  return { ok: true };
});
