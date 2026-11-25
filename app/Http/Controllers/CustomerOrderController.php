<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerOrderController extends Controller
{
    /**
     * Display the authenticated customer's order history and delivery tracking.
     */
    public function index(Request $request): Response
    {
        $orders = Order::query()
            ->where('user_id', $request->user()->id)
            ->with(['product:id,name,image,category,contents'])
            ->latest()
            ->get();

        return Inertia::render('orders/index', [
            'orders' => $orders,
        ]);
    }
}
