import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { CloseIcon } from 'assets/png';
import styles from './modal.module.scss'

interface IModal {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal: React.FC<IModal> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.modal} onClick={onClose}>
      <img src={CloseIcon} alt="close" onClick={onClose}/>
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById('portal-root') as HTMLElement 
  );
};