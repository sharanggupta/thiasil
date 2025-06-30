"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Modal, { ModalProps } from './Modal';
import ConfirmationModal, { ConfirmationModalProps } from './ConfirmationModal';

interface QueuedModal {
  id: string;
  type: 'modal' | 'confirmation';
  props: ModalProps | ConfirmationModalProps;
  onClose?: () => void;
}

interface ModalManagerContextType {
  openModal: (props: Omit<ModalProps, 'isOpen' | 'onClose'>) => string;
  closeModal: (id: string) => void;
  openConfirmation: (props: Omit<ConfirmationModalProps, 'isOpen' | 'onClose'>) => Promise<boolean>;
  closeAllModals: () => void;
  getActiveModalCount: () => number;
}

const ModalManagerContext = createContext<ModalManagerContextType | undefined>(undefined);

export interface ModalManagerProps {
  children: ReactNode;
  maxConcurrentModals?: number;
}

export function ModalManager({ children, maxConcurrentModals = 3 }: ModalManagerProps) {
  const [modals, setModals] = useState<QueuedModal[]>([]);
  const [modalQueue, setModalQueue] = useState<QueuedModal[]>([]);

  const generateId = useCallback(() => {
    return `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const processQueue = useCallback(() => {
    setModals(current => {
      setModalQueue(queue => {
        const availableSlots = maxConcurrentModals - current.length;
        if (availableSlots <= 0 || queue.length === 0) return queue;

        const toShow = queue.slice(0, availableSlots);
        const remaining = queue.slice(availableSlots);

        // Add queued modals to active modals
        setModals(prev => [...prev, ...toShow]);

        return remaining;
      });
      return current;
    });
  }, [maxConcurrentModals]);

  const openModal = useCallback((props: Omit<ModalProps, 'isOpen' | 'onClose'>) => {
    const id = generateId();
    const modal: QueuedModal = {
      id,
      type: 'modal',
      props: props as ModalProps
    };

    if (modals.length < maxConcurrentModals) {
      setModals(prev => [...prev, modal]);
    } else {
      setModalQueue(prev => [...prev, modal]);
    }

    return id;
  }, [generateId, modals.length, maxConcurrentModals]);

  const closeModal = useCallback((id: string) => {
    setModals(prev => {
      const modal = prev.find(m => m.id === id);
      if (modal?.onClose) {
        modal.onClose();
      }
      
      const filtered = prev.filter(m => m.id !== id);
      
      // Process queue after removing modal
      setTimeout(processQueue, 0);
      
      return filtered;
    });
  }, [processQueue]);

  const openConfirmation = useCallback((props: Omit<ConfirmationModalProps, 'isOpen' | 'onClose'>) => {
    return new Promise<boolean>((resolve) => {
      const id = generateId();
      
      const modal: QueuedModal = {
        id,
        type: 'confirmation',
        props: {
          ...props,
          onConfirm: () => {
            props.onConfirm();
            closeModal(id);
            resolve(true);
          }
        } as ConfirmationModalProps,
        onClose: () => resolve(false)
      };

      if (modals.length < maxConcurrentModals) {
        setModals(prev => [...prev, modal]);
      } else {
        setModalQueue(prev => [...prev, modal]);
      }
    });
  }, [generateId, modals.length, maxConcurrentModals, closeModal]);

  const closeAllModals = useCallback(() => {
    modals.forEach(modal => {
      if (modal.onClose) {
        modal.onClose();
      }
    });
    setModals([]);
    setModalQueue([]);
  }, [modals]);

  const getActiveModalCount = useCallback(() => {
    return modals.length;
  }, [modals.length]);

  const contextValue: ModalManagerContextType = {
    openModal,
    closeModal,
    openConfirmation,
    closeAllModals,
    getActiveModalCount
  };

  return (
    <ModalManagerContext.Provider value={contextValue}>
      {children}
      
      {/* Render active modals */}
      {modals.map((modal, index) => {
        const handleClose = () => closeModal(modal.id);
        const zIndex = 50 + index; // Ensure proper stacking

        if (modal.type === 'confirmation') {
          const props = modal.props as ConfirmationModalProps;
          return (
            <div key={modal.id} style={{ zIndex }}>
              <ConfirmationModal
                {...props}
                isOpen={true}
                onClose={handleClose}
              />
            </div>
          );
        } else {
          const props = modal.props as ModalProps;
          return (
            <div key={modal.id} style={{ zIndex }}>
              <Modal
                {...props}
                isOpen={true}
                onClose={handleClose}
              />
            </div>
          );
        }
      })}
    </ModalManagerContext.Provider>
  );
}

export function useModalManager() {
  const context = useContext(ModalManagerContext);
  if (!context) {
    throw new Error('useModalManager must be used within a ModalManager');
  }
  return context;
}

// Convenience hooks
export function useGlobalModal() {
  const { openModal, closeModal } = useModalManager();
  
  return {
    open: openModal,
    close: closeModal
  };
}

export function useGlobalConfirmation() {
  const { openConfirmation } = useModalManager();
  
  const confirm = useCallback(
    (message: string, options?: Partial<Omit<ConfirmationModalProps, 'isOpen' | 'onClose' | 'onConfirm' | 'message'>>) => {
      return openConfirmation({
        message,
        onConfirm: () => {}, // Will be overridden by the promise
        ...options
      });
    },
    [openConfirmation]
  );

  return { confirm };
}