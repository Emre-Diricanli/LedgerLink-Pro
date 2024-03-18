import React from 'react';

interface ModalBodyProps {
    children: React.ReactNode;
    styles?: React.CSSProperties;
}

const ModalBody: React.FC<ModalBodyProps> = ({ children, styles }) => {
    return <div className="modal-body" style={styles}>{children}</div>;
};

export default ModalBody;