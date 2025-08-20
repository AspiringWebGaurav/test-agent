import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoItem from '../TodoItem';
import { Timestamp } from 'firebase/firestore';
import { vi } from 'vitest';
import type { Todo } from '@/types';

const toggleTodo = vi.fn();
const updateTodo = vi.fn();
const deleteTodo = vi.fn();
vi.mock('@/hooks/useTodos', () => ({
  useTodos: () => ({ toggleTodo, updateTodo, deleteTodo })
}));

const sample: Todo = {
  id: '1',
  title: 'Sample',
  isCompleted: false,
  createdAt: Timestamp.fromMillis(Date.now()),
  updatedAt: Timestamp.fromMillis(Date.now()),
};

describe('TodoItem', () => {
  it('toggles completion', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={sample} />);
    const [toggleBtn] = screen.getAllByLabelText(/mark complete/i);
    await user.click(toggleBtn);
    expect(toggleTodo).toHaveBeenCalledWith('1', true);
  });

  it('edits title', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={sample} />);
    const [edit] = screen.getAllByLabelText(/edit todo/i);
    await user.click(edit);
    const input = screen.getByPlaceholderText(/todo title/i);
    await user.clear(input);
    await user.type(input, 'Updated');
    await user.click(screen.getByRole('button', { name: /save/i }));
    expect(updateTodo).toHaveBeenCalledWith('1', expect.any(Object));
  });

  it('deletes todo', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={sample} />);
    const [del] = screen.getAllByLabelText(/delete todo/i);
    await user.click(del);
    const buttons = screen.getAllByRole('button', { name: /delete todo/i });
    await user.click(buttons[buttons.length - 1]);
    expect(deleteTodo).toHaveBeenCalledWith('1');
  });
});
