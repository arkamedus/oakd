import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Icon from "../../Icon/Icon";
import { sizeMinusOne } from "../../Core/Core.utils";
import ThumbnailSelect from "./ThumbnailSelect";
const options = [
  {
    value: "cube",
    title: "Cube",
    note: "Block",
    preview: <Icon name="Cube" />,
  },
  {
    value: "sphere",
    title: "Sphere",
    note: "Round",
    preview: <Icon name="Sphere" />,
  },
];

it("maps rich source options back through the callback and closes", () => {
  const change = jest.fn();
  render(<ThumbnailSelect options={options} onChange={change} />);
  const trigger = screen.getByRole("button", { name: "Select an option" });
  fireEvent.click(trigger);
  fireEvent.click(screen.getByRole("option", { name: /Cube/ }));
  expect(change.mock.calls[0][0]).toBe("cube");
  expect(change.mock.calls[0][1].note).toBe("Block");
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(
    screen.queryByRole("option", { name: /Sphere/ }),
  ).not.toBeInTheDocument();
});

it("keeps option names distinct from regular-weight notes", () => {
  render(<ThumbnailSelect options={options} open />);

  expect(
    screen.getByText("Cube").closest(".oakd-thumbnail-select__title"),
  ).toBeInTheDocument();
  expect(screen.getByText("Block")).toHaveClass("oakd-thumbnail-select__note");
});

it("closes when clicking outside", () => {
  const openChange = jest.fn();
  render(<ThumbnailSelect options={options} onOpenChange={openChange} />);

  const trigger = screen.getByRole("button", { name: "Select an option" });
  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute("aria-expanded", "true");

  fireEvent.mouseDown(document.body);

  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(
    screen.queryByRole("option", { name: /Cube/ }),
  ).not.toBeInTheDocument();
  expect(openChange).toHaveBeenLastCalledWith(false);
});

it("closes on Escape and returns focus to the trigger", () => {
  render(<ThumbnailSelect options={options} />);

  const trigger = screen.getByRole("button", { name: "Select an option" });
  fireEvent.click(trigger);
  const search = screen.getByRole("textbox");
  fireEvent.keyDown(search, { key: "Escape" });

  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(trigger).toHaveFocus();
});

it.each(["small", "default", "large"] as const)(
  "forwards the %s Select size contract",
  (size) => {
    render(
      <ThumbnailSelect options={options} defaultValue="cube" size={size} />,
    );

    const trigger = screen.getByRole("button", { name: "Cube" });
    expect(trigger).toHaveClass(`size-${size}`);
    expect(trigger.closest(".oakd-search-select")).toHaveClass(`size-${size}`);
    expect(trigger.querySelector(".icon")).toHaveClass(
      `icon-${sizeMinusOne(size)}`,
    );
  },
);

it("accepts both library icons and preserved-color image sources as previews", () => {
  const imageSource = "data:image/svg+xml,%3Csvg/%3E";
  render(
    <ThumbnailSelect
      defaultValue="image"
      options={[
        {
          value: "icon",
          title: "Icon",
          preview: <Icon name="Cube" aria-label="Library icon" />,
        },
        {
          value: "image",
          title: "Image",
          preview: (
            <Icon
              name="Picture"
              src={imageSource}
              preserveColor
              aria-label="Image source"
            />
          ),
        },
      ]}
    />,
  );

  const imagePreview = screen.getByLabelText("Image source");
  expect(imagePreview).toHaveStyle({
    backgroundImage: `url(${imageSource})`,
    backgroundColor: "transparent",
  });

  fireEvent.click(screen.getByRole("button", { name: /Image/ }));
  expect(screen.getByLabelText("Library icon")).toHaveStyle({
    backgroundColor: "currentColor",
  });
});
