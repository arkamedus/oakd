import React from "react";
import Content from "../../Layout/Content/Content";
import SearchSelect from "../SearchSelect/SearchSelect";
import { SearchSelectOption } from "../SearchSelect/SearchSelect.types";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";
import { CoreComponentSizeType } from "../../Core/Core.types";
import { sizeMinusOne } from "../../Core/Core.utils";
import "./ThumbnailSelect.css";
import { ThumbnailSelectProps } from "./ThumbnailSelect.types";

const sizeTriggerPreview = (
  preview: React.ReactNode,
  size: CoreComponentSizeType,
) => {
  if (!React.isValidElement(preview) || typeof preview.type === "string") {
    return preview;
  }

  return React.cloneElement(
    preview as React.ReactElement<{ size?: CoreComponentSizeType }>,
    { size: sizeMinusOne(size) },
  );
};

export default function ThumbnailSelect<T>({
  options,
  onChange,
  size = "default",
  ...rest
}: ThumbnailSelectProps<T>) {
  const sourceByValue = new Map(
    options.map((option) => [option.value, option]),
  );
  const searchOptions: SearchSelectOption<T>[] = options.map((option) => ({
    value: option.value,
    label: (
      <Space align="center" gap noWrap>
        {option.preview ? (
          <Content className="oakd-thumbnail-select__preview">
            {sizeTriggerPreview(option.preview, size)}
          </Content>
        ) : null}
        {typeof option.title === "string" ? (
          <Paragraph>{option.title}</Paragraph>
        ) : (
          option.title
        )}
      </Space>
    ),
    searchText: [
      typeof option.title === "string" ? option.title : "",
      ...(option.keywords || []),
    ].join(" "),
    disabled: option.disabled,
    render: (
      <Space
        className="oakd-thumbnail-select__option"
        align="center"
        gap
        wide
        noWrap
      >
        {option.preview ? (
          <Content className="oakd-thumbnail-select__preview">
            {option.preview}
          </Content>
        ) : null}
        <Content grow>
          <Content className="oakd-thumbnail-select__title">
            {typeof option.title === "string" ? (
              <Paragraph>{option.title}</Paragraph>
            ) : (
              option.title
            )}
          </Content>
          {option.note ? (
            typeof option.note === "string" ? (
              <Paragraph className="oakd-thumbnail-select__note">
                {option.note}
              </Paragraph>
            ) : (
              option.note
            )
          ) : null}
        </Content>
      </Space>
    ),
  }));
  return (
    <SearchSelect
      {...rest}
      size={size}
      options={searchOptions}
      onChange={(value) => {
        const source = sourceByValue.get(value);
        if (source) onChange?.(value, source);
      }}
    />
  );
}
