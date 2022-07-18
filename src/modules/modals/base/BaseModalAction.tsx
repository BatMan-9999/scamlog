import { PropsWithChildren, MouseEvent } from "react";
import { X } from "react-feather";

export default function BaseModalActions({
  id,
  close,
  children,
  onCancel,
}: BaseModalActionProps & PropsWithChildren) {
  return (
    <div
      className="modal-action"
    >
      <label
        htmlFor={id}
        className="btn"
        onClick={(e) => {
          if (onCancel) onCancel(e);
        }}
      >
        <X /> {close ?? "Dismiss"}
      </label>
      {children}
    </div>
  );
}

export interface BaseModalActionProps {
  close?: string;
  id: string;
  onCancel?: (e: MouseEvent<HTMLLabelElement, globalThis.MouseEvent>) => any;
}
