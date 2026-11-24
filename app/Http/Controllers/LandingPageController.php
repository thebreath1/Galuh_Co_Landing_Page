<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class LandingPageController extends Controller
{
    /**
     * Display the landing page.
     */
    public function index(): Response
    {
        $products = Product::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $testimonials = Testimonial::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        $siteSettings = SiteSetting::resolved();
        $whatsappNumber = $siteSettings['whatsapp_number'] ?: (string) config('services.whatsapp.number', '6281234567890');

        return Inertia::render('welcome', [
            'products' => $products,
            'testimonials' => $testimonials,
            'whatsappNumber' => $whatsappNumber,
            'siteSettings' => $siteSettings,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }
}
