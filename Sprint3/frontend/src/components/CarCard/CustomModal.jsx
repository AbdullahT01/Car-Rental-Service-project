import React from 'react';
import './carCard.css';

const CustomModal = ({isOpen, children, onClose}) => {

  if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {children}
          </div>
        </div>
      );
    };

export default CustomModal;