import {ButtonProps} from "../Button/Button.types";

export interface AudioInputProps extends Omit<ButtonProps, "onChange"> {
  onChange: (value: string) => void;
}
