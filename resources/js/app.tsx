import { Suspense, lazy, type ReactNode } from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { initializeTheme } from '@/hooks/use-appearance';

const LazyAppLayout = lazy(() => import('@/layouts/app-layout'));
const LazyAuthLayout = lazy(() => import('@/layouts/auth-layout'));
const LazySettingsLayout = lazy(() => import('@/layouts/settings/layout'));
const LazyToaster = lazy(() =>
    import('@/components/ui/sonner').then((m) => ({ default: m.Toaster }))
);
const LazyTooltipProvider = lazy(() =>
    import('@/components/ui/tooltip').then((m) => ({ default: m.TooltipProvider }))
);

const AppLayoutWrapper = (props: Record<string, unknown> & { children: ReactNode }) => (
    <Suspense fallback={null}>
        <LazyTooltipProvider delayDuration={0}>
            <LazyAppLayout {...props} />
        </LazyTooltipProvider>
    </Suspense>
);

const AuthLayoutWrapper = (props: Record<string, unknown> & { children: ReactNode }) => (
    <Suspense fallback={null}>
        <LazyAuthLayout {...props} />
    </Suspense>
);

const SettingsLayoutWrapper = ({ children }: { children: ReactNode }) => (
    <Suspense fallback={null}>
        <LazySettingsLayout>{children}</LazySettingsLayout>
    </Suspense>
);

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayoutWrapper;
            case name.startsWith('settings/'):
                return [AppLayoutWrapper, SettingsLayoutWrapper];
            default:
                return AppLayoutWrapper;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <>
                {app}
                <Suspense fallback={null}>
                    <LazyToaster />
                </Suspense>
            </>
        );
    },
    progress: {
        color: '#C8A951',
    },
});

// This will set light / dark mode on load...
initializeTheme();
