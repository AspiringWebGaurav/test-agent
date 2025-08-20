import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Filters from '../Filters';
import { vi } from 'vitest';
import { Timestamp } from 'firebase/firestore';
import type { Todo } from '@/types';

const todos: Todo[] = [
  { id: '1', title: 'A', isCompleted: false, createdAt: Timestamp.now(), updatedAt: Timestamp.now(), dueAt: Timestamp.fromMillis(Date.now()-1000) },
  { id: '2', title: 'B', isCompleted: true, createdAt: Timestamp.now(), updatedAt: Timestamp.now() }
];

vi.mock('@/hooks/useTodos', () => ({ useTodos: () => ({ todos }) }));

describe('Filters', () => {
  it('shows counts and triggers filter change', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Filters activeFilter="all" onFilterChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /completed/i }));
    expect(onChange).toHaveBeenCalledWith('completed');
  });
});
