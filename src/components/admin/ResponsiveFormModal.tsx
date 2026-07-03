/**
 * ResponsiveFormModal
 * Shared shell for admin form modals.
 * - Desktop (>=md): centered modal at `width` (default 640) — unchanged feel.
 * - Mobile (<md): full-screen sheet with a pinned footer and body-only scroll,
 *   so the primary action is always thumb-reachable on long forms.
 * Passes through every AntD ModalProp (footer, onOk, okText, confirmLoading, ...).
 *
 * zIndex is forced above the admin bottom bar (1200) so the pinned footer / action
 * buttons are never covered by the mobile nav — and the mask hides it while open.
 */

import React from 'react';
import { Modal, Grid } from 'antd';
import type { ModalProps } from 'antd';
import './ResponsiveFormModal.scss';

const { useBreakpoint } = Grid;

export interface ResponsiveFormModalProps extends Omit<ModalProps, 'width'> {
  /** Desktop width in px. Ignored on mobile (always full-screen). */
  width?: number;
}

const ResponsiveFormModal: React.FC<ResponsiveFormModalProps> = ({
  width = 640,
  className,
  zIndex = 1300,
  children,
  ...rest
}) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const mergedClassName = [
    'responsive-form-modal',
    isMobile && 'responsive-form-modal--mobile',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Modal
      {...rest}
      width={isMobile ? '100%' : width}
      centered={!isMobile}
      zIndex={zIndex}
      style={isMobile ? { top: 0, maxWidth: '100vw', margin: 0, paddingBottom: 0 } : undefined}
      className={mergedClassName}
    >
      {children}
    </Modal>
  );
};

export default ResponsiveFormModal;
