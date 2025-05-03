/* eslint-disable react/prop-types */
import { useLayoutEffect } from "react";
import { IoMdClose } from "react-icons/io";

const Modal = ({ isVisible, onClose, children }) => {

  useLayoutEffect(() => {
    if (isVisible) {
     
      document.body.style.overflow = "hidden";
    }
    return () => {
    
      document.body.style.overflow = "";
    };
  }, [isVisible]);


  if (!isVisible) return null;

  const handleWrapperClick = (e) => {
 
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleWrapperClick}
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-black bg-opacity-25 backdrop-blur-sm"
    >
      <div
        className="relative w-1/2 max-h-[calc(100vh-5rem)] flex flex-col
                   bg-white rounded overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 text-2xl text-gray-700
                     hover:bg-gray-100 rounded-full z-10"
        >
          <IoMdClose />
        </button>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
  
