import { describe, it, expect } from 'vitest';
import { dragEvent, resizeEvent } from '../src/lib/timetableUtils';

describe('timetable utils', () => {
  it('drags event within bounds', () => {
    expect(dragEvent(60, 30)).toBe(90);
    expect(dragEvent(10, -20)).toBe(0);
  });

  it('resizes event enforcing minimum duration', () => {
    expect(resizeEvent(60, 30)).toBe(90);
    expect(resizeEvent(40, -20)).toBe(30);
  });
});
