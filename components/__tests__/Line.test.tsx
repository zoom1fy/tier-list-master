import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Line } from "../tier-list/Line";
import type { TierRow } from "@/types/TierRow";

const row: TierRow = {
  id: "s",
  name: "S",
  label: "S",
  backgroundColorClass: "tier-s",
  items: [
    { id: "1", name: "Item 1", imageUrl: "https://example.com/1.png", tier: "s" },
    { id: "2", name: "Item 2", imageUrl: "https://example.com/2.png", tier: "s" },
  ],
};

it("renders label and items", () => {
  render(
    <Line
      row={row}
      onDragOver={vi.fn()}
      onDrop={vi.fn()}
      onDragStart={vi.fn()}
    />,
  );
  expect(screen.getByText("S")).toBeInTheDocument();
  expect(screen.getByText("Item 1")).toBeInTheDocument();
  expect(screen.getByText("Item 2")).toBeInTheDocument();
});

it("forwards data-row-id attribute", () => {
  const { container } = render(
    <Line
      row={row}
      onDragOver={vi.fn()}
      onDrop={vi.fn()}
      onDragStart={vi.fn()}
      data-row-id="s"
    />,
  );
  expect(container.firstChild).toHaveAttribute("data-row-id", "s");
});

it("calls onRename when label is edited", async () => {
  const onRename = vi.fn();
  const user = userEvent.setup();
  render(
    <Line
      row={row}
      onDragOver={vi.fn()}
      onDrop={vi.fn()}
      onDragStart={vi.fn()}
      onRename={onRename}
    />,
  );

  await user.click(screen.getByRole("button", { name: "S" }));
  const input = screen.getByRole("textbox");
  await user.clear(input);
  await user.type(input, "SS");
  await user.tab();

  expect(onRename).toHaveBeenCalledWith("s", "SS");
});

it("renders empty items list", () => {
  const emptyRow = { ...row, items: [] };
  const { container } = render(
    <Line
      row={emptyRow}
      onDragOver={vi.fn()}
      onDrop={vi.fn()}
      onDragStart={vi.fn()}
    />,
  );
  expect(screen.getByText("S")).toBeInTheDocument();
  const cards = container.querySelectorAll("[draggable]");
  expect(cards.length).toBe(0);
});
