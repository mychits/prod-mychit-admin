/* eslint-disable react/prop-types */
import { IoMdClose } from "react-icons/io";
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
        <div className="w-[600px] flex flex-col relative">
          <button
            className="text-gray-700 text-2xl absolute top-2 right-2 hover:bg-gray-100"
            onClick={() => onClose()}
          >
           <IoMdClose />
          </button>
          <div className="bg-white p-2 rounded">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;
