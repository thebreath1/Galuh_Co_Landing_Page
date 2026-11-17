<?php

namespace App\Http\Controllers;

use App\Models\Product;
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

        $whatsappNumber = (string) config('services.whatsapp.number', '6281234567890');

        return Inertia::render('welcome', [
            'products' => $products,
            'whatsappNumber' => $whatsappNumber,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }
}
