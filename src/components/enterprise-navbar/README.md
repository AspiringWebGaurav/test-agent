# Enterprise Navbar

A responsive, single top navigation bar designed for enterprise applications. It consolidates primary routes, workspace switching and global actions like sync, notifications and user menu.

## Components

- `EnterpriseNavbar` – top-level navbar component.
- `NavPrimary` – renders primary navigation links with active state.
- `WorkspaceSwitcher` – button displaying current workspace.
- `SyncButton` – sync control with state machine (`idle`, `syncing`, `success`, `error`, `disabled`).

## Usage

```tsx
import { EnterpriseNavbar, NavRoute } from "@/components/enterprise-navbar";

const routes: NavRoute[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard" },
  { id: "notes", label: "Notes", href: "/notes" },
];

<EnterpriseNavbar
  routes={routes}
  workspaceName="Gaurav’s Personal Notes"
  user={{ name: "Gaurav" }}
  sync={{ onSync: () => Promise.resolve() }}
/>
```

All props are fully typed and ready for i18n and dark mode styling through Tailwind.
