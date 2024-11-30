/* eslint-disable react/prop-types */
import { IoMdCloseCircle } from "react-icons/io";
const Modal = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  const handleClose = (e) => {
    if (e.target.id === "wrapper") onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-10"
        onClick={handleClose}
      >
        <div className="w-[600px] flex flex-col">
          <button
            className="text-gray-700 text-2xl place-self-end"
            onClick={() => onClose()}
          >
            <IoMdCloseCircle />
          </button>
          <div className="bg-white p-2 rounded">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;
