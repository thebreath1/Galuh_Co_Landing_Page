export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#A88B54]/45 bg-[#0B1322] p-0.5">
                <img
                    src="/images/logo-gold.webp"
                    alt="GALUH & CO."
                    className="h-full w-full object-contain"
                />
            </div>
            <div className="ml-1.5 grid flex-1 text-left leading-tight">
                <span className="truncate font-serif text-sm font-bold tracking-[0.12em] text-sidebar-foreground uppercase">
                    GALUH &amp; CO.
                </span>
                <span className="truncate text-[10px] font-medium tracking-[0.18em] text-[#C5AA74] uppercase">
                    Admin Atelier
                </span>
            </div>
        </>
    );
}
