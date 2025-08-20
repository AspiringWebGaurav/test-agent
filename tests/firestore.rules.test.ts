import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { promises as fs } from 'fs';
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

let testEnv: any;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-test',
    firestore: {
      rules: await fs.readFile('./firestore.rules', 'utf8'),
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe('firestore todo rules', () => {
  it('allows create with valid priority', async () => {
    const ctx = testEnv.authenticatedContext('alice');
    const ref = doc(ctx.firestore(), 'users/alice/todos/one');
    await assertSucceeds(setDoc(ref, {
      id: 'one',
      title: 'ok',
      isCompleted: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      priority: 2,
    }));
  });

  it('rejects create with invalid priority', async () => {
    const ctx = testEnv.authenticatedContext('bob');
    const ref = doc(ctx.firestore(), 'users/bob/todos/one');
    await assertFails(setDoc(ref, {
      id: 'one',
      title: 'bad',
      isCompleted: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      priority: 7,
    }));
  });
});
