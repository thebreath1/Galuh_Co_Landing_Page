import { Link, usePage } from '@inertiajs/react';
import {
    ExternalLink,
    Inbox,
    LayoutGrid,
    MessageSquareQuote,
    Package,
    Percent,
    ShoppingBag,
    Sparkles,
    Truck,
} from 'lucide-react';
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
import { index as contentIndex } from '@/routes/admin/content';
import { index as inquiriesIndex } from '@/routes/admin/inquiries';
import { index as ordersIndex } from '@/routes/admin/orders';
import { index as productsIndex } from '@/routes/admin/products';
import { index as promosIndex } from '@/routes/admin/promos';
import { index as shipmentsIndex } from '@/routes/admin/shipments';
import { index as testimonialsIndex } from '@/routes/admin/testimonials';
import { mine as ordersMine } from '@/routes/orders';
import type { NavItem, User } from '@/types';

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
        title: 'Pelacakan Paket',
        href: shipmentsIndex(),
        icon: Truck,
    },
    {
        title: 'Kelola Katalog',
        href: productsIndex(),
        icon: Package,
    },
    {
        title: 'Promo & Diskon',
        href: promosIndex(),
        icon: Percent,
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

const customerNavItems: NavItem[] = [
    {
        title: 'Pesanan Saya',
        href: ordersMine(),
        icon: ShoppingBag,
    },
    {
        title: 'Beranda Katalog',
        href: home(),
        icon: ExternalLink,
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
    const { auth } = usePage<{ auth?: { user?: User | null } }>().props;
    const isAdmin = auth?.user?.role === 'admin';
    const navItems = isAdmin ? mainNavItems : customerNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href={isAdmin ? dashboard() : home()}
                                prefetch
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
