import { describe, it, expect } from 'vitest';
import { Timestamp } from 'firebase/firestore';
import { createSnoozeTimestamp } from '../src/lib/todoUtils';

describe('snooze util', () => {
  it('adds 30 minutes when snoozing', () => {
    const now = Timestamp.fromMillis(0);
    const snoozed = createSnoozeTimestamp(now);
    expect(snoozed.toMillis()).toBe(30 * 60 * 1000);
  });
});
