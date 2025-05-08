import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const ProjectSettingPopover = ({ onClose }) => {
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose(); // click ngoài thì đóng
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999]">
      <div
        ref={popoverRef}
        className="bg-white shadow-lg rounded-xl p-4 w-[200px] border"
      >
        xin chào
      </div>
    </div>,
    document.body
  );
};

export default ProjectSettingPopover;
