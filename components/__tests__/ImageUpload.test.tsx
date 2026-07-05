import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImageUpload } from "../tier-list/ImageUpload";

it("renders URL input, Load, Choose image buttons", () => {
  render(<ImageUpload onAddItem={vi.fn()} />);
  expect(screen.getByPlaceholderText("Image URL...")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Load" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Choose image" })).toBeInTheDocument();
});

it("shows preview after entering URL and clicking Load", async () => {
  const user = userEvent.setup();
  const { container } = render(<ImageUpload onAddItem={vi.fn()} />);

  await user.type(screen.getByPlaceholderText("Image URL..."), "https://example.com/img.png");
  await user.click(screen.getByRole("button", { name: "Load" }));

  expect(container.querySelector("img")).toHaveAttribute("src", "https://example.com/img.png");
  expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
});

it("calls onAddItem with the item and resets form on Add", async () => {
  const onAdd = vi.fn();
  const user = userEvent.setup();
  render(<ImageUpload onAddItem={onAdd} />);

  await user.type(screen.getByPlaceholderText("Image URL..."), "https://example.com/img.png");
  await user.click(screen.getByRole("button", { name: "Load" }));
  await user.clear(screen.getByPlaceholderText("Enter name"));
  await user.type(screen.getByPlaceholderText("Enter name"), "My Image");
  await user.click(screen.getByRole("button", { name: "Add" }));

  expect(onAdd).toHaveBeenCalledWith(
    expect.objectContaining({
      name: "My Image",
      imageUrl: "https://example.com/img.png",
      tier: "unassigned",
    }),
  );

  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(screen.queryByPlaceholderText("Enter name")).not.toBeInTheDocument();
});

it("does not call onAddItem when preview is missing", async () => {
  const onAdd = vi.fn();
  render(<ImageUpload onAddItem={onAdd} />);

  const addBtn = screen.queryByRole("button", { name: "Add" });
  expect(addBtn).not.toBeInTheDocument();
});
