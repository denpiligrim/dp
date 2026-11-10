import { Dialog } from '@mui/material';
import { DialogProps } from '@mui/material';

/** Adds guide styling to a portal without changing dialog or QR-code behaviour. */
export function GuideDialog({ className = '', ...props }: DialogProps) {
  return <Dialog {...props} className={`guide-dialog ${className}`} />;
}
