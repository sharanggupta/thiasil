import { useState, useCallback } from 'react';

export interface UseModalOptions {
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export function useModal({ defaultOpen = false, onOpen, onClose }: UseModalOptions = {}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen
  };
}

// Hook for confirmation modals
export function useConfirmationModal() {
  const modal = useModal();
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const confirm = useCallback((action: () => void) => {
    setPendingAction(() => action);
    modal.open();
  }, [modal]);

  const handleConfirm = useCallback(() => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    modal.close();
  }, [pendingAction, modal]);

  const handleCancel = useCallback(() => {
    setPendingAction(null);
    modal.close();
  }, [modal]);

  return {
    ...modal,
    confirm,
    handleConfirm,
    handleCancel,
    hasPendingAction: pendingAction !== null
  };
}

// Hook for form modals
export function useFormModal<T = any>() {
  const modal = useModal();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openWithData = useCallback((initialData?: T) => {
    setData(initialData || null);
    setError(null);
    modal.open();
  }, [modal]);

  const closeAndReset = useCallback(() => {
    modal.close();
    setData(null);
    setError(null);
    setLoading(false);
  }, [modal]);

  const handleSubmit = useCallback(async (submitFn: (data: T) => Promise<void>) => {
    if (!data) return;

    setLoading(true);
    setError(null);

    try {
      await submitFn(data);
      closeAndReset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [data, closeAndReset]);

  return {
    ...modal,
    data,
    setData,
    loading,
    error,
    openWithData,
    closeAndReset,
    handleSubmit,
    close: closeAndReset // Override close to reset data
  };
}

// Hook for multi-step modals
export function useMultiStepModal(totalSteps: number) {
  const modal = useModal();
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
  }, [totalSteps]);

  const reset = useCallback(() => {
    setCurrentStep(0);
  }, []);

  const closeAndReset = useCallback(() => {
    modal.close();
    reset();
  }, [modal, reset]);

  return {
    ...modal,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    goToStep,
    reset,
    closeAndReset,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    progress: ((currentStep + 1) / totalSteps) * 100,
    close: closeAndReset // Override close to reset steps
  };
}