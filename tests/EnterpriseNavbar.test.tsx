import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EnterpriseNavbar, NavRoute } from "@/components/enterprise-navbar";

describe("EnterpriseNavbar", () => {
  const routes: NavRoute[] = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard" },
    { id: "hidden", label: "Hidden", href: "/hidden", hidden: true },
  ];

  it("renders visible routes and hides others", () => {
    render(
      <EnterpriseNavbar
        routes={routes}
        workspaceName="GPN"
        user={{ name: "Gaurav" }}
        sync={{ onSync: () => Promise.resolve() }}
      />,
    );
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });
});
