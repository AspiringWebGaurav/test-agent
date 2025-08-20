import type { Meta, StoryObj } from "@storybook/react";
import { EnterpriseNavbar } from ".";

const meta: Meta<typeof EnterpriseNavbar> = {
  component: EnterpriseNavbar,
  title: "Enterprise/Navbar/EnterpriseNavbar",
};
export default meta;
type Story = StoryObj<typeof EnterpriseNavbar>;

const routes = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard" },
  { id: "notes", label: "Notes", href: "/notes" },
  { id: "todos", label: "Todos", href: "/todos" },
  { id: "money", label: "Money", href: "/money" },
  { id: "templates", label: "Templates", href: "/templates" },
];

export const Light: Story = {
  args: {
    routes,
    workspaceName: "Gaurav’s Personal Notes",
    user: { name: "Gaurav" },
    sync: { onSync: async () => {} },
  },
};

export const Dark: Story = {
  args: {
    routes,
    workspaceName: "Gaurav’s Personal Notes",
    user: { name: "Gaurav" },
    sync: { onSync: async () => {} },
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
