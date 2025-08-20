import type { Meta, StoryObj } from "@storybook/react";
import { SyncButton } from "./SyncButton";

const meta: Meta<typeof SyncButton> = {
  component: SyncButton,
  title: "Enterprise/Navbar/SyncButton",
  args: { onSync: async () => {} },
};
export default meta;
type Story = StoryObj<typeof SyncButton>;

export const Idle: Story = {
  args: { lastSyncedAt: new Date(), initialState: "idle" },
};
export const Syncing: Story = {
  args: { initialState: "syncing" },
};
export const Success: Story = {
  args: { initialState: "success" },
};
export const Error: Story = {
  args: { initialState: "error" },
};
export const Disabled: Story = {
  args: { initialState: "disabled", disabled: true },
};
