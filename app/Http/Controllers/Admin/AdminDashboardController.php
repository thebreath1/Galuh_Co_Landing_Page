<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\Order;
use App\Models\Product;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    /**
     * Show admin overview dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('dashboard', [
            'stats' => [
                'pendingOrders' => Order::query()->where('status', Order::STATUS_PENDING)->count(),
                'totalOrders' => Order::query()->count(),
                'totalProducts' => Product::query()->count(),
                'activeProducts' => Product::query()->where('is_active', true)->count(),
                'totalTestimonials' => Testimonial::query()->count(),
                'activeTestimonials' => Testimonial::query()->where('is_active', true)->count(),
                'totalInquiries' => Inquiry::query()->count(),
                'categoriesCount' => Product::query()->distinct('category')->count('category'),
            ],
            'recentOrders' => Order::query()
                ->latest()
                ->take(5)
                ->get(),
            'recentProducts' => Product::query()
                ->orderBy('sort_order')
                ->orderByDesc('id')
                ->take(4)
                ->get(),
            'recentInquiries' => Inquiry::query()
                ->latest()
                ->take(5)
                ->get(),
            'heroHeadline' => SiteSetting::resolved()['hero_headline'],
        ]);
    }
}
