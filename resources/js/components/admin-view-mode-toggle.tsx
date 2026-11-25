import { useEffect, useState } from 'react';
import { LayoutList, List } from 'lucide-react';

export type AdminViewMode = 'detail' | 'minimal';

export function useAdminViewMode(
    storageKey: string,
    defaultMode: AdminViewMode = 'detail',
) {
    const [viewMode, setViewMode] = useState<AdminViewMode>(() => {
        if (typeof window === 'undefined') return defaultMode;
        const saved = window.localStorage.getItem(storageKey);
        return saved === 'minimal' || saved === 'detail' ? saved : defaultMode;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(storageKey, viewMode);
        }
    }, [storageKey, viewMode]);

    return [viewMode, setViewMode] as const;
}

interface AdminViewModeToggleProps {
    value: AdminViewMode;
    onChange: (mode: AdminViewMode) => void;
}

export function AdminViewModeToggle({
    value,
    onChange,
}: AdminViewModeToggleProps) {
    return (
        <div
            role="group"
            aria-label="Pilih mode tampilan"
            className="inline-flex shrink-0 items-center rounded-lg border border-border bg-secondary/75 p-0.5"
        >
            <button
                type="button"
                onClick={() => onChange('detail')}
                aria-pressed={value === 'detail'}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                    value === 'detail'
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                }`}
            >
                <LayoutList className="size-3.5" />
                <span>Detail</span>
            </button>
            <button
                type="button"
                onClick={() => onChange('minimal')}
                aria-pressed={value === 'minimal'}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                    value === 'minimal'
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                }`}
            >
                <List className="size-3.5" />
                <span>Minimalis</span>
            </button>
        </div>
    );
}
