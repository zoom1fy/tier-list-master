import { render, screen } from "@testing-library/react";
import { Card } from "../tier-list/Card";
import type { TierItem } from "@/types/TierItem";

const baseItem: TierItem = {
  id: "1",
  name: "Test Item",
  imageUrl: "https://example.com/img.png",
  tier: "s",
};

it("renders name and image", () => {
  render(<Card item={baseItem} />);
  expect(screen.getByText("Test Item")).toBeInTheDocument();
  expect(screen.getByRole("img")).toHaveAttribute("src", baseItem.imageUrl);
});

it("truncates name longer than 30 characters", () => {
  const longName = "A".repeat(40);
  render(<Card item={{ ...baseItem, name: longName }} />);
  expect(screen.getByText("A".repeat(30))).toBeInTheDocument();
  expect(screen.queryByText(longName)).not.toBeInTheDocument();
});

it("sets draggable attribute", () => {
  const { container } = render(<Card item={baseItem} draggable />);
  expect(container.firstChild).toHaveAttribute("draggable", "true");
});

it("renders without image when imageUrl is empty", () => {
  render(<Card item={{ ...baseItem, imageUrl: "" }} />);
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(screen.getByText("Test Item")).toBeInTheDocument();
});
