<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Promo;
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
        $activePromos = Promo::query()
            ->currentlyActive()
            ->orderByDesc('discount_percent')
            ->get();

        $products = Product::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(function (Product $product) use ($activePromos) {
                $payload = $product->toArray();
                $payload['active_promo'] = Promo::resolveBestForProduct($product, $activePromos);

                return $payload;
            })
            ->values();

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
