import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="bg-paper-texture dark:bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-luxury">
                <div className="flex flex-col gap-7">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#A88B54]/45 bg-[#16233B] p-1.5 shadow-xs">
                                <img
                                    src="/images/logo-gold.webp"
                                    alt="GALUH & CO."
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <span className="font-serif text-xs font-bold tracking-[0.22em] text-[#725C30] uppercase dark:text-[#C5AA74]">
                                GALUH &amp; CO.
                            </span>
                        </Link>

                        <div className="h-px w-12 bg-[#A88B54]" aria-hidden="true" />

                        <div className="space-y-1.5 text-center">
                            <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
                                {title}
                            </h1>
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
