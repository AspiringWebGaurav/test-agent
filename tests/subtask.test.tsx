import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SubtaskList, { Subtask } from '../src/components/todos/SubtaskList';

describe('SubtaskList', () => {
  it('toggles subtasks', async () => {
    const user = userEvent.setup();
    const subtasks: Subtask[] = [
      { id: '1', title: 'child', done: false }
    ];
    const onToggle = vi.fn();
    render(<SubtaskList subtasks={subtasks} onToggle={onToggle} />);
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith('1', true);
  });
});
