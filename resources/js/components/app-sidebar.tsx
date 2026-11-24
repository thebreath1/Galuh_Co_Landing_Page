import { Link } from '@inertiajs/react';
import { ExternalLink, Inbox, LayoutGrid, MessageSquareQuote, Package, ShoppingBag, Sparkles } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, home } from '@/routes';
import { index as ordersIndex } from '@/routes/admin/orders';
import { index as productsIndex } from '@/routes/admin/products';
import { index as contentIndex } from '@/routes/admin/content';
import { index as testimonialsIndex } from '@/routes/admin/testimonials';
import { index as inquiriesIndex } from '@/routes/admin/inquiries';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Pesanan Masuk',
        href: ordersIndex(),
        icon: ShoppingBag,
    },
    {
        title: 'Kelola Katalog',
        href: productsIndex(),
        icon: Package,
    },
    {
        title: 'Teks & Hero',
        href: contentIndex(),
        icon: Sparkles,
    },
    {
        title: 'Testimoni',
        href: testimonialsIndex(),
        icon: MessageSquareQuote,
    },
    {
        title: 'Inquiry Masuk',
        href: inquiriesIndex(),
        icon: Inbox,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Lihat Landing Page',
        href: home(),
        icon: ExternalLink,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
