import { ExternalLink } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { home } from '@/routes';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/80 bg-card/80 px-6 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:rounded-t-xl md:px-5">
            <div className="flex items-center gap-2.5">
                <SidebarTrigger className="-ml-1 text-foreground hover:bg-secondary hover:text-foreground" />
                <span className="hidden h-4 w-px bg-[#A88B54]/40 sm:inline-block" aria-hidden="true" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <a
                href={home.url()}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-[#A88B54] hover:bg-secondary sm:inline-flex"
            >
                <span>Katalog Publik</span>
                <ExternalLink className="size-3 text-[#725C30] dark:text-[#C5AA74]" />
            </a>
        </header>
    );
}
