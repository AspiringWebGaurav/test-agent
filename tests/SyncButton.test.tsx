import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SyncButton } from "@/components/enterprise-navbar";

describe("SyncButton", () => {
  it("calls callbacks on successful sync", async () => {
    const onSync = vi.fn().mockResolvedValue(undefined);
    const onSyncStart = vi.fn();
    const onSyncSuccess = vi.fn();
    render(
      <SyncButton
        onSync={onSync}
        onSyncStart={onSyncStart}
        onSyncSuccess={onSyncSuccess}
        lastSyncedAt={new Date(Date.now() - 2 * 60 * 1000)}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onSyncStart).toHaveBeenCalled();
    expect(onSync).toHaveBeenCalled();
    await waitFor(() => expect(onSyncSuccess).toHaveBeenCalled());
    expect(screen.getByText(/Synced/)).toBeInTheDocument();
  });
});
