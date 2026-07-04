import { HiExclamationTriangle } from 'react-icons/hi2';
import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      closeOnOverlay={!isLoading}
    >
      <div className="text-center py-2">
        <div className="mx-auto w-12 h-12 rounded-full bg-error-50 flex items-center justify-center mb-4">
          <HiExclamationTriangle className="w-6 h-6 text-error-600" />
        </div>

        <h3 className="text-h4 text-surface-900 mb-2">{title}</h3>
        <p className="text-body text-surface-500 mb-6">{message}</p>

        <div className="flex items-center gap-3 justify-center">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
