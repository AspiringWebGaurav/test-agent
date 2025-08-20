import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddTodoForm from '../AddTodoForm';
import { vi } from 'vitest';

const createTodo = vi.fn();
vi.mock('@/hooks/useTodos', () => ({
  useTodos: () => ({ createTodo })
}));

describe('AddTodoForm', () => {
  it('submits new todo', async () => {
    const user = userEvent.setup();
    render(<AddTodoForm />);

    await user.click(screen.getByText(/add a new todo/i));
    const input = screen.getByPlaceholderText(/what needs to be done/i);
    await user.type(input, 'Test todo');
    await user.click(screen.getByRole('button', { name: /add todo/i }));

    expect(createTodo).toHaveBeenCalledWith({ title: 'Test todo', notes: undefined, dueAt: undefined });
  });
});
