import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface ConfirmDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => void;
    processing?: boolean;
}

/**
 * In-app confirmation modal replacing native window.confirm() so delete
 * actions remain reliable inside embedded browsers and iframes.
 */
export function ConfirmDeleteDialog({
    open,
    onOpenChange,
    title,
    description,
    onConfirm,
    processing = false,
}: ConfirmDeleteDialogProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={(next) => !processing && onOpenChange(next)}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mb-1 flex items-center gap-2.5">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10 text-destructive">
                            <AlertTriangle className="size-4" />
                        </div>
                        <DialogTitle className="font-serif text-lg">
                            {title}
                        </DialogTitle>
                    </div>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <DialogFooter className="pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={processing}
                        onClick={() => onOpenChange(false)}
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={processing}
                        onClick={onConfirm}
                    >
                        <Trash2 className="size-4" />
                        {processing ? 'Menghapus...' : 'Ya, Hapus'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
