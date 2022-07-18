import { PropsWithChildren } from "react";

export default function BaseModal({
  id,
  title,
  children,
}: BaseModalProps & PropsWithChildren) {
  return (
    <>
      <input type="checkbox" id={id} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          {children}
        </div>
      </div>
    </>
  );
}

export interface BaseModalProps {
  id: string;
  title: string;
}
