import React from "react";
import { CoreComponentProps } from "../../Core/Core.types";

export type ScriptSandboxStatus =
  | "idle"
  | "running"
  | "success"
  | "error"
  | "reset";

export type ScriptSandboxError = {
  message: string;
  stack?: string;
  name?: string;
  line?: number;
  column?: number;
};

export type ScriptSandboxBaseProps = Omit<
  CoreComponentProps<HTMLDivElement>,
  "ref"
>;

export interface ScriptSandboxProps extends ScriptSandboxBaseProps {
  src: string;
  autoRun?: boolean;
  controls?: boolean;
  title?: string;
  initialBackground?: string;

  onPrint?: (line: string) => void;
  onSuccess?: () => void;
  onError?: (err: ScriptSandboxError) => void;
  onStatus?: (status: ScriptSandboxStatus) => void;

  className?: string;
  style?: React.CSSProperties;
}
