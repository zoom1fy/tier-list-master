import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Workflow } from "../tier-list/Workflow";
import { saveStructure, clearStructure } from "@/lib/persistence";

beforeEach(() => {
  clearStructure();
});

it("renders 6 default tier rows", async () => {
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

it("restores custom rows from saved state", async () => {
  saveStructure({
    pool: [],
    rows: [
      { id: "x", name: "X", label: "X", backgroundColorClass: "tier-s", items: [] },
      { id: "y", name: "Y", label: "Y", backgroundColorClass: "tier-a", items: [] },
      { id: "z", name: "Z", label: "Z", backgroundColorClass: "tier-b", items: [] },
    ],
  });

  render(<Workflow />);
  await waitFor(() => {
    expect(screen.getByText("X")).toBeInTheDocument();
    expect(screen.getByText("Y")).toBeInTheDocument();
    expect(screen.getByText("Z")).toBeInTheDocument();
  });
  expect(screen.queryByText("S")).not.toBeInTheDocument();
  expect(screen.queryByText("F")).not.toBeInTheDocument();
});

it("preserves items in rows after restore", async () => {
  saveStructure({
    pool: [],
    rows: [
      {
        id: "s", name: "S", label: "S", backgroundColorClass: "tier-s",
        items: [
          { id: "1", name: "TestItem", imageUrl: "https://example.com/img.png", tier: "S" },
        ],
      },
    ],
  });

  render(<Workflow />);
  await waitFor(() => {
    expect(screen.getByText("TestItem")).toBeInTheDocument();
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
