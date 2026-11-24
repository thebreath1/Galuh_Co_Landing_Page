<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Store a manual product order from the landing page for admin review/ACC.
     */
    public function store(StoreOrderRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $product = Product::query()
            ->where('is_active', true)
            ->findOrFail($validated['product_id']);

        $quantity = (int) $validated['quantity'];
        $unitPrice = (int) $product->price_from;

        $order = Order::query()->create([
            'order_code' => $this->generateOrderCode(),
            'product_id' => $product->id,
            'product_name' => $product->name,
            'unit_price' => $unitPrice,
            'quantity' => $quantity,
            'total_price' => $unitPrice * $quantity,
            'customer_name' => $validated['customer_name'],
            'customer_whatsapp' => $validated['customer_whatsapp'],
            'customer_email' => $validated['customer_email'] ?: null,
            'delivery_date' => $validated['delivery_date'] ?: null,
            'shipping_address' => $validated['shipping_address'],
            'greeting_card_note' => $validated['greeting_card_note'] ?: null,
            'payment_method' => $validated['payment_method'] ?? 'transfer_bca',
            'status' => Order::STATUS_PENDING,
        ]);

        return redirect()->back()->with(
            'success',
            "Pesanan {$order->order_code} untuk \"{$product->name}\" ({$quantity} paket) berhasil tercatat dan sedang menunggu ACC admin."
        );
    }

    private function generateOrderCode(): string
    {
        do {
            $code = 'GC-' . now()->format('ymd') . '-' . Str::upper(Str::random(4));
        } while (Order::query()->where('order_code', $code)->exists());

        return $code;
    }
}
