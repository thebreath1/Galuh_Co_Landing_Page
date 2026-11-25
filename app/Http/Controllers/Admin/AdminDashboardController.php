<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\Order;
use App\Models\Product;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use Carbon\CarbonImmutable;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    /**
     * Show admin overview dashboard.
     */
    public function index(): Response
    {
        $today = CarbonImmutable::today();
        $windowStart = $today->subDays(6)->startOfDay();

        $ordersInWindow = Order::query()
            ->where('created_at', '>=', $windowStart)
            ->get(['created_at', 'total_price', 'status']);

        $inquiriesInWindow = Inquiry::query()
            ->where('created_at', '>=', $windowStart)
            ->get(['created_at']);

        $ordersByDay = $ordersInWindow->groupBy(fn (Order $o) => $o->created_at->format('Y-m-d'));
        $inquiriesByDay = $inquiriesInWindow->groupBy(fn (Inquiry $i) => $i->created_at->format('Y-m-d'));

        $dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        $activitySeries = collect(range(6, 0))->map(function (int $daysAgo) use ($today, $ordersByDay, $inquiriesByDay, $dayNames) {
            $date = $today->subDays($daysAgo);
            $key = $date->format('Y-m-d');
            $dayOrders = $ordersByDay->get($key, collect());
            $dayInquiries = $inquiriesByDay->get($key, collect());

            return [
                'date' => $key,
                'label' => $dayNames[$date->dayOfWeek],
                'fullDate' => $date->format('d M'),
                'orders' => $dayOrders->count(),
                'inquiries' => $dayInquiries->count(),
                'revenue' => (int) $dayOrders
                    ->whereIn('status', [Order::STATUS_APPROVED, Order::STATUS_COMPLETED])
                    ->sum('total_price'),
            ];
        })->values();

        $categoryBreakdown = Product::query()
            ->get(['category', 'is_active'])
            ->groupBy('category')
            ->map(fn ($items, string $category) => [
                'category' => $category,
                'total' => $items->count(),
                'active' => $items->where('is_active', true)->count(),
            ])
            ->values();

        return Inertia::render('dashboard', [
            'stats' => [
                'pendingOrders' => Order::query()->where('status', Order::STATUS_PENDING)->count(),
                'approvedOrders' => Order::query()->where('status', Order::STATUS_APPROVED)->count(),
                'completedOrders' => Order::query()->where('status', Order::STATUS_COMPLETED)->count(),
                'rejectedOrders' => Order::query()->where('status', Order::STATUS_REJECTED)->count(),
                'totalOrders' => Order::query()->count(),
                'confirmedRevenue' => (int) Order::query()
                    ->whereIn('status', [Order::STATUS_APPROVED, Order::STATUS_COMPLETED])
                    ->sum('total_price'),
                'pendingRevenue' => (int) Order::query()
                    ->where('status', Order::STATUS_PENDING)
                    ->sum('total_price'),
                'totalProducts' => Product::query()->count(),
                'activeProducts' => Product::query()->where('is_active', true)->count(),
                'totalTestimonials' => Testimonial::query()->count(),
                'activeTestimonials' => Testimonial::query()->where('is_active', true)->count(),
                'totalInquiries' => Inquiry::query()->count(),
                'categoriesCount' => Product::query()->distinct('category')->count('category'),
            ],
            'activitySeries' => $activitySeries,
            'categoryBreakdown' => $categoryBreakdown,
            'recentOrders' => Order::query()
                ->latest()
                ->take(8)
                ->get(),
            'recentProducts' => Product::query()
                ->orderBy('sort_order')
                ->orderByDesc('id')
                ->take(6)
                ->get(),
            'recentInquiries' => Inquiry::query()
                ->latest()
                ->take(6)
                ->get(),
            'heroHeadline' => SiteSetting::resolved()['hero_headline'],
        ]);
    }
}
