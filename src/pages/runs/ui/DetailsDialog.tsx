import { RunDetails, RunStatusBadge, type Run } from "../../../entities/run";
import { ModalDialog } from "../../../shared/ui/modal-dialog/ModalDialog";

type DetailsDialogProps = {
  run: Run;
  onClose: () => void;
};

export function DetailsDialog({ run, onClose }: DetailsDialogProps) {
  return (
    <ModalDialog title={run.name} badge={<RunStatusBadge status={run.status} />} onClose={onClose}>
      <RunDetails run={run} />
    </ModalDialog>
  );
}
