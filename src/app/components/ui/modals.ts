// Modal components
export { default as Modal } from './Modal';
export { default as ConfirmationModal } from './ConfirmationModal';
export { default as FormModal } from './FormModal';
export { ModalManager, useModalManager, useGlobalModal, useGlobalConfirmation } from './ModalManager';

// Modal hooks
export { useModal, useConfirmationModal, useFormModal, useMultiStepModal } from './useModal';

// Type exports
export type { ModalProps, ModalAction } from './Modal';
export type { ConfirmationModalProps } from './ConfirmationModal';
export type { FormModalProps } from './FormModal';
export type { ModalManagerProps } from './ModalManager';
export type { UseModalOptions } from './useModal';