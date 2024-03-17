import React, { useState, useEffect } from 'react';
import '../create-new-user/CreateNewUserModal.css';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: (arg0: boolean) => void;
  headerText?: string;
  bodyText?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, headerText, bodyText }) => {
const handleModalClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent click from propagating to the backdrop
    };
    
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => onClose(false)}>
      <div className="modal-content" onClick={handleModalClick}>
        <div className="modal-body">
          <div className="flex flex-row items-center justify-start gap-2 w-full pb-2">
              <h2>{headerText || 'Confirm Delete'}</h2>
              </div>
          <div className="flex flex-row gap-2 content-center justify-start w-full pt-4">
              <div className="flex flex-col content-center justify-start gap-0 w-full ">
                  <p>{bodyText || 'Are you sure you want to delete this?'}</p>
              </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-2 w-full mt-8">
              <button className="" onClick={() => onClose(false)} >
                  Cancel
              </button>
              <button className="danger" onClick={() => onClose(true)}>
                  Confirm
              </button>
          </div>  
        </div> 
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
