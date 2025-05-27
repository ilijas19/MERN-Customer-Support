import type React from "react";

type ModalProps = {
  isModalOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};
const Modal = ({ isModalOpen, onClose, children }: ModalProps) => {
  return (
    isModalOpen && (
      <div
        onClick={onClose}
        style={{ background: "rgba(0,0,0,0.5)" }}
        className="fixed inset-0 flex justify-center p-1 "
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-800 rounded-lg h-fit max-w-[700px] sm:mt-12 w-full not-sm:h-full p-4 px-6"
        >
          {children}
        </div>
      </div>
    )
  );
};
export default Modal;
