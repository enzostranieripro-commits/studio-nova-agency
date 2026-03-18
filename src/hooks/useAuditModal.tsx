import React, { createContext, useContext, useState } from 'react';

interface AuditModalContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const AuditModalContext = createContext<AuditModalContextType>({ isOpen: false, open: () => {}, close: () => {} });

export const useAuditModal = () => useContext(AuditModalContext);

export const AuditModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <AuditModalContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </AuditModalContext.Provider>
  );
};
