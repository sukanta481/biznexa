'use client';

import { useCallback, useState } from 'react';

/**
 * Downloads an admin export endpoint as a file.
 *
 * The export routes stream a file rather than JSON, so this navigates via a
 * synthetic anchor instead of fetch — that keeps the browser's own download
 * handling, including the filename from Content-Disposition. There is no
 * response to await, so the spinner is a fixed nudge that the click landed.
 */
export default function ExcelExportButton({
    href,
    label = 'Excel',
    title = 'Export to Excel',
    disabled = false,
    className = '',
}: {
    href: string;
    label?: string;
    title?: string;
    disabled?: boolean;
    className?: string;
}) {
    const [busy, setBusy] = useState(false);

    const handleClick = useCallback(() => {
        setBusy(true);
        const link = document.createElement('a');
        link.href = href;
        link.download = '';
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => setBusy(false), 800);
    }, [href]);

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled || busy}
            title={title}
            className={`flex items-center justify-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm font-bold text-emerald-300 transition hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        >
            <span className={`material-symbols-outlined text-sm ${busy ? 'animate-spin' : ''}`}>
                {busy ? 'progress_activity' : 'table_view'}
            </span>
            {label}
        </button>
    );
}
