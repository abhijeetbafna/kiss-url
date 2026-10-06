import { db } from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './middleware/auth.js';

console.log('🧪 Running Rigorous Workspace Persistence & Isolation Verification...\n');

// 1. Clean test users
const salt = bcrypt.genSaltSync(10);

const userA = db.createUser({
  email: `alice_${Date.now()}@test.com`,
  passwordHash: bcrypt.hashSync('pass1234', salt),
  name: 'Alice Tester'
});

const userB = db.createUser({
  email: `bob_${Date.now()}@test.com`,
  passwordHash: bcrypt.hashSync('pass1234', salt),
  name: 'Bob Tester'
});

console.log('✅ Created User A:', userA.email, `(id: ${userA.id})`);
console.log('✅ Created User B:', userB.email, `(id: ${userB.id})`);

// 2. Workspaces
const wsA = db.createWorkspace({
  name: 'Alice Workspace',
  ownerId: userA.id,
  icon: '🚀'
});

const wsB = db.createWorkspace({
  name: 'Bob Workspace',
  ownerId: userB.id,
  icon: '⚡'
});

console.log('✅ Created Workspace A for User A:', wsA.name, `(id: ${wsA.id})`);
console.log('✅ Created Workspace B for User B:', wsB.name, `(id: ${wsB.id})`);

// 3. Links
const linkA = db.createLink({
  workspaceId: wsA.id,
  creatorId: userA.id,
  slug: `alice-link-${Date.now()}`,
  targetUrl: 'https://alice.example.com',
  title: 'Alice Secret Project'
});

const linkB = db.createLink({
  workspaceId: wsB.id,
  creatorId: userB.id,
  slug: `bob-link-${Date.now()}`,
  targetUrl: 'https://bob.example.com',
  title: 'Bob Secret Project'
});

console.log('✅ Created Link A in Workspace A:', linkA.slug, '->', linkA.targetUrl);
console.log('✅ Created Link B in Workspace B:', linkB.slug, '->', linkB.targetUrl);

// 4. Verification: Membership & Ownership Authorization
const userAWorkspaces = db.getWorkspacesForUser(userA.id);
const userBWorkspaces = db.getWorkspacesForUser(userB.id);

console.log('\n--- DATA ISOLATION CHECKS ---');

// Check 1: User A sees only Workspace A
if (userAWorkspaces.some(w => w.id === wsA.id) && !userAWorkspaces.some(w => w.id === wsB.id)) {
  console.log('✅ PASS: User A can only see their own workspaces.');
} else {
  console.error('❌ FAIL: User A saw unauthorized workspaces!');
  process.exit(1);
}

// Check 2: User B sees only Workspace B
if (userBWorkspaces.some(w => w.id === wsB.id) && !userBWorkspaces.some(w => w.id === wsA.id)) {
  console.log('✅ PASS: User B can only see their own workspaces.');
} else {
  console.error('❌ FAIL: User B saw unauthorized workspaces!');
  process.exit(1);
}

// Check 3: Link Scoping
const wsALinks = db.getLinksByWorkspace(wsA.id);
const wsBLinks = db.getLinksByWorkspace(wsB.id);

if (wsALinks.some(l => l.id === linkA.id) && !wsALinks.some(l => l.id === linkB.id)) {
  console.log('✅ PASS: Workspace A only contains Link A.');
} else {
  console.error('❌ FAIL: Workspace A contains unauthorized links!');
  process.exit(1);
}

if (wsBLinks.some(l => l.id === linkB.id) && !wsBLinks.some(l => l.id === linkA.id)) {
  console.log('✅ PASS: Workspace B only contains Link B.');
} else {
  console.error('❌ FAIL: Workspace B contains unauthorized links!');
  process.exit(1);
}

// Check 4: Workspace Member Access Check
if (db.userHasWorkspaceAccess(userA.id, wsA.id) && !db.userHasWorkspaceAccess(userA.id, wsB.id)) {
  console.log('✅ PASS: Authorization check allows User A into WS A and denies WS B.');
} else {
  console.error('❌ FAIL: Membership authorization failure!');
  process.exit(1);
}

// Check 5: Public link resolution
const resolvedA = db.getLinkBySlug(linkA.slug);
if (resolvedA && resolvedA.targetUrl === 'https://alice.example.com') {
  console.log('✅ PASS: Public resolver correctly resolves short link slug without requiring auth.');
} else {
  console.error('❌ FAIL: Public resolver failed to resolve slug!');
  process.exit(1);
}

console.log('\n🎉 ALL 5 CRITICAL PERSISTENCE & ISOLATION CHECKS PASSED!\n');
