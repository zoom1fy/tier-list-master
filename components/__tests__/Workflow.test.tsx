import { render, screen, waitFor } from "@testing-library/react";
import { Workflow } from "../tier-list/Workflow";

it("renders 6 tier rows", async () => {
  render(<Workflow />);
  await waitFor(() => {
    expect(screen.getByText("S")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
    expect(screen.getByText("D")).toBeInTheDocument();
    expect(screen.getByText("F")).toBeInTheDocument();
  });
});

it("renders ImageUpload and unassigned pool", async () => {
  render(<Workflow />);
  await waitFor(() => {
    expect(screen.getByPlaceholderText("Image URL...")).toBeInTheDocument();
    expect(screen.getByText("Unassigned (0)")).toBeInTheDocument();
    expect(screen.getByText("Add images above or drag items here from tiers")).toBeInTheDocument();
  });
});

it("renders pool with items when they exist", async () => {
  const { container } = render(<Workflow />);
  await waitFor(() => {
    const poolZone = container.querySelector("[data-drop-zone]");
    expect(poolZone).toBeInTheDocument();
  });
});

it("marks the tier-list container with correct id", async () => {
  const { container } = render(<Workflow />);
  await waitFor(() => {
    expect(container.querySelector("#tier-list")).toBeInTheDocument();
  });
});
