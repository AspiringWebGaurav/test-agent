import { ReactNode } from "react";

export type NavRoute = {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
  isActive?: boolean;
  hidden?: boolean;
};

export type { SyncState, SyncButtonProps } from "./SyncButton";
