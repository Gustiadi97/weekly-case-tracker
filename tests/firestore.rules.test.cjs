const fs = require("node:fs");
const path = require("node:path");
const {
  after,
  before,
  beforeEach,
  test
} = require("node:test");
const {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment
} = require("@firebase/rules-unit-testing");
const {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch
} = require("firebase/firestore");

const PROJECT_ID = "demo-weekly-case-tracker";
const CASE_ID = "case-1";
const ACTION_ID = "action-1";
const MEMBER_UID = "member-1";
const OTHER_MEMBER_UID = "member-2";
const COORDINATOR_UID = "coordinator-1";
const ADMIN_UID = "admin-1";
const CREATED_AT = "2026-11-12T08:00:00.000Z";
const EDITED_AT = "2026-11-12T08:15:00.000Z";

let testEnv;

function db(uid) {
  return testEnv.authenticatedContext(uid).firestore();
}

async function seedBaseData() {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();

    await Promise.all([
      setDoc(doc(firestore, "users", ADMIN_UID), {
        full_name: "Admin Test",
        role: "admin",
        active: true
      }),
      setDoc(doc(firestore, "users", COORDINATOR_UID), {
        full_name: "Coordinator Test",
        role: "coordinator",
        active: true
      }),
      setDoc(doc(firestore, "users", MEMBER_UID), {
        full_name: "Member Test",
        role: "member",
        active: true
      }),
      setDoc(doc(firestore, "users", OTHER_MEMBER_UID), {
        full_name: "Other Member Test",
        role: "member",
        active: true
      }),
      setDoc(doc(firestore, "team_directory", ADMIN_UID), { full_name: "Admin Test", role: "admin", active: true, deleted: false }),
      setDoc(doc(firestore, "team_directory", COORDINATOR_UID), { full_name: "Coordinator Test", role: "coordinator", active: true, deleted: false }),
      setDoc(doc(firestore, "team_directory", MEMBER_UID), { full_name: "Member Test", role: "member", active: true, deleted: false }),
      setDoc(doc(firestore, "team_directory", OTHER_MEMBER_UID), { full_name: "Other Member Test", role: "member", active: true, deleted: false }),
      setDoc(doc(firestore, "cases", CASE_ID), {
        case_code: "CASE-001",
        title: "Test case",
        status: "open",
        created_by: COORDINATOR_UID,
        created_at: CREATED_AT
      }),
      setDoc(doc(firestore, "actions", ACTION_ID), {
        case_id: CASE_ID,
        title: "Investigate package",
        assigned_to: MEMBER_UID,
        status: "open",
        progress: 0,
        created_by: COORDINATOR_UID,
        created_at: CREATED_AT,
        updated_at: CREATED_AT
      })
    ]);
  });
}

function progressRow(overrides = {}) {
  return {
    case_id: CASE_ID,
    action_id: ACTION_ID,
    update_text: "Initial progress update",
    progress_before: 0,
    progress_after: 45,
    blocker: "",
    next_step: "Continue investigation",
    status_after: "in_progress",
    created_by: MEMBER_UID,
    created_at: EDITED_AT,
    ...overrides
  };
}

async function seedLatestProgressLog() {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await Promise.all([
      setDoc(doc(firestore, "progress_logs", "log-1"), progressRow({
        progress_before: 0,
        progress_after: 40,
        status_after: "in_progress",
        created_at: CREATED_AT
      })),
      updateDoc(doc(firestore, "actions", ACTION_ID), {
        progress: 40,
        status: "in_progress",
        updated_at: CREATED_AT,
        latest_progress_log_id: "log-1"
      })
    ]);
  });
}

before(async () => {
  const rulesPath = path.join(__dirname, "..", "firestore.rules");
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: fs.readFileSync(rulesPath, "utf8")
    }
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  await seedBaseData();
});

after(async () => {
  if (testEnv) await testEnv.cleanup();
});

test("private user profiles are readable only by their owner and Admin", async () => {
  const memberDb = db(MEMBER_UID);
  await assertSucceeds(getDoc(doc(memberDb, "users", MEMBER_UID)));
  await assertFails(getDoc(doc(memberDb, "users", OTHER_MEMBER_UID)));
  await assertFails(getDocs(collection(memberDb, "users")));
  await assertSucceeds(getDocs(collection(db(ADMIN_UID), "users")));
});

test("active staff can read the minimal team directory but cannot modify it", async () => {
  const memberDb = db(MEMBER_UID);
  await assertSucceeds(getDocs(collection(memberDb, "team_directory")));
  await assertFails(updateDoc(doc(memberDb, "team_directory", OTHER_MEMBER_UID), {
    full_name: "Changed by member"
  }));
});

test("Admin directory writes must mirror the private profile and contain only directory fields", async () => {
  const adminDb = db(ADMIN_UID);
  const batch = writeBatch(adminDb);
  batch.update(doc(adminDb, "users", MEMBER_UID), {
    full_name: "Renamed Member",
    role: "coordinator"
  });
  batch.set(doc(adminDb, "team_directory", MEMBER_UID), {
    full_name: "Renamed Member",
    role: "coordinator",
    active: true,
    deleted: false
  });
  await assertSucceeds(batch.commit());

  await assertFails(setDoc(doc(adminDb, "team_directory", "missing-user"), {
    full_name: "Unknown User",
    role: "member",
    active: true,
    deleted: false
  }));
  await assertFails(setDoc(doc(adminDb, "team_directory", OTHER_MEMBER_UID), {
    full_name: "Other Member Test",
    role: "member",
    active: true,
    deleted: false,
    login_id: "PRIVATE-ID"
  }));
});

test("coordinator can create a Case; regular member cannot", async () => {
  const coordinatorDb = db(COORDINATOR_UID);
  await assertSucceeds(setDoc(doc(coordinatorDb, "cases", "case-created"), {
    case_code: "CASE-002",
    title: "New test case",
    status: "open",
    created_by: COORDINATOR_UID
  }));

  const memberDb = db(MEMBER_UID);
  await assertFails(setDoc(doc(memberDb, "cases", "case-member"), {
    case_code: "CASE-003",
    title: "Member-created case",
    status: "open",
    created_by: MEMBER_UID
  }));
});

test("Action must reference an existing Case", async () => {
  const coordinatorDb = db(COORDINATOR_UID);

  await assertFails(setDoc(doc(coordinatorDb, "actions", "orphan-action"), {
    case_id: "case-does-not-exist",
    title: "Orphan Action",
    assigned_to: MEMBER_UID,
    status: "open",
    progress: 0,
    created_by: COORDINATOR_UID
  }));

  await assertSucceeds(setDoc(doc(coordinatorDb, "actions", "valid-action"), {
    case_id: CASE_ID,
    title: "Valid Action",
    assigned_to: MEMBER_UID,
    status: "open",
    progress: 0,
    created_by: COORDINATOR_UID
  }));
});

test("assigned PIC can create a progress log and update its Action in one batch", async () => {
  const memberDb = db(MEMBER_UID);
  const batch = writeBatch(memberDb);

  batch.update(doc(memberDb, "actions", ACTION_ID), {
    progress: 45,
    status: "in_progress",
    updated_at: EDITED_AT,
    latest_progress_log_id: "log-valid"
  });
  batch.set(doc(memberDb, "progress_logs", "log-valid"), progressRow());

  await assertSucceeds(batch.commit());
});

test("progress log cannot point to a different Case than its Action", async () => {
  const memberDb = db(MEMBER_UID);
  const batch = writeBatch(memberDb);

  batch.update(doc(memberDb, "actions", ACTION_ID), {
    progress: 45,
    status: "in_progress",
    updated_at: EDITED_AT,
    latest_progress_log_id: "log-wrong-case"
  });
  batch.set(doc(memberDb, "progress_logs", "log-wrong-case"), progressRow({
    case_id: "another-case"
  }));

  await assertFails(batch.commit());
});

test("an unassigned member cannot write progress for another PIC's Action", async () => {
  const otherDb = db(OTHER_MEMBER_UID);
  const batch = writeBatch(otherDb);

  batch.update(doc(otherDb, "actions", ACTION_ID), {
    progress: 45,
    status: "in_progress",
    updated_at: EDITED_AT,
    latest_progress_log_id: "log-unassigned"
  });
  batch.set(doc(otherDb, "progress_logs", "log-unassigned"), progressRow({
    created_by: OTHER_MEMBER_UID
  }));

  await assertFails(batch.commit());
});

test("Action progress cannot be changed without a corresponding progress log", async () => {
  const memberDb = db(MEMBER_UID);

  await assertFails(updateDoc(doc(memberDb, "actions", ACTION_ID), {
    progress: 70,
    status: "review",
    updated_at: EDITED_AT
  }));
});

test("a progress log cannot be created unless the Action is updated in the same batch", async () => {
  const memberDb = db(MEMBER_UID);

  await assertFails(setDoc(doc(memberDb, "progress_logs", "log-without-action-update"), progressRow()));
});

test("editing a progress log without its append-only audit record is denied", async () => {
  await seedLatestProgressLog();
  const memberDb = db(MEMBER_UID);

  await assertFails(updateDoc(doc(memberDb, "progress_logs", "log-1"), {
    update_text: "Edited without audit",
    progress_after: 70,
    blocker: "",
    next_step: "Next step",
    status_after: "review",
    edited_at: EDITED_AT,
    edited_by: MEMBER_UID,
    last_edit_audit_id: "audit-missing"
  }));
});

test("latest progress correction requires its audit and Action update in one batch", async () => {
  await seedLatestProgressLog();
  const memberDb = db(MEMBER_UID);
  const batch = writeBatch(memberDb);
  const after = {
    update_text: "Corrected progress update",
    progress_after: 75,
    blocker: "Waiting for confirmation",
    next_step: "Escalate to coordinator",
    status_after: "review"
  };
  const beforeState = {
    update_text: "Initial progress update",
    progress_before: 0,
    progress_after: 40,
    blocker: "",
    next_step: "Continue investigation",
    status_after: "in_progress"
  };

  batch.update(doc(memberDb, "progress_logs", "log-1"), {
    ...after,
    edited_at: EDITED_AT,
    edited_by: MEMBER_UID,
    last_edit_audit_id: "audit-1"
  });
  batch.set(doc(memberDb, "progress_log_edits", "audit-1"), {
    case_id: CASE_ID,
    action_id: ACTION_ID,
    log_id: "log-1",
    edited_by: MEMBER_UID,
    created_at: EDITED_AT,
    before: beforeState,
    after,
    latest_update: true
  });
  batch.update(doc(memberDb, "actions", ACTION_ID), {
    progress: 75,
    status: "review",
    updated_at: EDITED_AT,
    latest_progress_log_id: "log-1"
  });

  await assertSucceeds(batch.commit());
});

test("latest progress correction is denied when Action is not updated", async () => {
  await seedLatestProgressLog();
  const memberDb = db(MEMBER_UID);
  const batch = writeBatch(memberDb);
  const after = {
    update_text: "Corrected without Action update",
    progress_after: 75,
    blocker: "",
    next_step: "Next step",
    status_after: "review"
  };

  batch.update(doc(memberDb, "progress_logs", "log-1"), {
    ...after,
    edited_at: EDITED_AT,
    edited_by: MEMBER_UID,
    last_edit_audit_id: "audit-2"
  });
  batch.set(doc(memberDb, "progress_log_edits", "audit-2"), {
    case_id: CASE_ID,
    action_id: ACTION_ID,
    log_id: "log-1",
    edited_by: MEMBER_UID,
    created_at: EDITED_AT,
    before: {
      update_text: "Initial progress update",
      progress_before: 0,
      progress_after: 40,
      blocker: "",
      next_step: "Continue investigation",
      status_after: "in_progress"
    },
    after,
    latest_update: true
  });

  await assertFails(batch.commit());
});

test("a user cannot correct another member's progress log", async () => {
  await seedLatestProgressLog();
  const otherDb = db(OTHER_MEMBER_UID);
  const batch = writeBatch(otherDb);
  const after = {
    update_text: "Unauthorized correction",
    progress_after: 80,
    blocker: "",
    next_step: "Next",
    status_after: "review"
  };

  batch.update(doc(otherDb, "progress_logs", "log-1"), {
    ...after,
    edited_at: EDITED_AT,
    edited_by: OTHER_MEMBER_UID,
    last_edit_audit_id: "audit-other"
  });
  batch.set(doc(otherDb, "progress_log_edits", "audit-other"), {
    case_id: CASE_ID,
    action_id: ACTION_ID,
    log_id: "log-1",
    edited_by: OTHER_MEMBER_UID,
    created_at: EDITED_AT,
    before: {},
    after,
    latest_update: true
  });
  batch.update(doc(otherDb, "actions", ACTION_ID), {
    progress: 80,
    status: "review",
    updated_at: EDITED_AT,
    latest_progress_log_id: "log-1"
  });

  await assertFails(batch.commit());
});
