import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import SyncButton from '../src/components/SyncButton';

describe('SyncButton', () => {
  it('disables and shows spinner during sync', async () => {
    const user = userEvent.setup();
    let resolve: () => void = () => {};
    const doSync = vi.fn(() => new Promise<void>(r => (resolve = r)));
    render(<SyncButton doSync={doSync} />);
    const button = screen.getByRole('button', { name: /sync/i });
    await user.click(button);
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Syncing…')).toBeInTheDocument();
    resolve();
    await screen.findByText('Synced');
    expect(button).not.toBeDisabled();
  });

  it('shows error state and retries', async () => {
    const user = userEvent.setup();
    const doSync = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce(undefined);
    const onSyncSuccess = vi.fn();
    render(<SyncButton doSync={doSync} onSyncSuccess={onSyncSuccess} />);
    const button = screen.getByRole('button', { name: /sync/i });
    await user.click(button);
    await screen.findByText('Sync issue');
    expect(doSync).toHaveBeenCalledTimes(1);
    await user.click(button); // retry
    await screen.findByText('Synced');
    expect(doSync).toHaveBeenCalledTimes(2);
    expect(onSyncSuccess).toHaveBeenCalledTimes(1);
  });
});
