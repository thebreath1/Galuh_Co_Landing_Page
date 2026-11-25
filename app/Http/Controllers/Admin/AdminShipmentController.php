<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminShipmentController extends Controller
{
    private const STAGE_LABELS = [
        Order::STAGE_CURATING => 'Perakitan & Kurasi Hampers',
        Order::STAGE_PACKED => 'Dikemas Siap Kirim',
        Order::STAGE_SHIPPED => 'Dalam Pengiriman Kurir',
        Order::STAGE_DELIVERED => 'Paket Sudah Sampai',
    ];

    /**
     * Display approved & completed orders for fulfillment and delivery tracking.
     */
    public function index(): Response
    {
        $shipments = Order::query()
            ->whereIn('status', [Order::STATUS_APPROVED, Order::STATUS_COMPLETED])
            ->with(['product:id,name,image,category,contents', 'reviewer:id,name'])
            ->latest()
            ->get()
            ->map(function (Order $order) {
                // Ensure legacy approved/completed records always report a valid stage cleanly.
                if (! in_array($order->fulfillment_stage, Order::FULFILLMENT_STAGES, true)) {
                    $order->fulfillment_stage = $order->status === Order::STATUS_COMPLETED
                        ? Order::STAGE_DELIVERED
                        : Order::STAGE_CURATING;
                } elseif ($order->status === Order::STATUS_COMPLETED && $order->fulfillment_stage !== Order::STAGE_DELIVERED) {
                    $order->fulfillment_stage = Order::STAGE_DELIVERED;
                }

                return $order;
            })
            ->values();

        return Inertia::render('admin/shipments', [
            'shipments' => $shipments,
        ]);
    }

    /**
     * Update package fulfillment stage, courier details, tracking number, and live position notes.
     */
    public function update(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'fulfillment_stage' => ['required', 'string', Rule::in(Order::FULFILLMENT_STAGES)],
            'courier_name' => ['nullable', 'string', 'max:100'],
            'tracking_number' => ['nullable', 'string', 'max:100'],
            'recipient_name' => ['nullable', 'string', 'max:150'],
            'shipping_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $stage = $validated['fulfillment_stage'];
        $courier = ($validated['courier_name'] ?? null) ?: null;
        $trackingNumber = ($validated['tracking_number'] ?? null) ?: null;
        $recipient = ($validated['recipient_name'] ?? null) ?: null;
        $note = ($validated['shipping_notes'] ?? null) ?: null;

        $history = is_array($order->tracking_history) ? $order->tracking_history : [];
        $stageLabel = self::STAGE_LABELS[$stage] ?? 'Pembaruan Pengiriman';

        $details = array_filter([
            $note,
            $courier ? "Kurir: {$courier}" : null,
            $trackingNumber ? "Resi: {$trackingNumber}" : null,
            $stage === Order::STAGE_DELIVERED && $recipient ? "Diterima oleh: {$recipient}" : null,
        ]);

        $history[] = [
            'stage' => $stage,
            'label' => $stageLabel,
            'note' => implode(' • ', $details) ?: "Status diperbarui ke {$stageLabel}.",
            'actor' => $request->user()?->name ?? 'Admin',
            'timestamp' => now()->toIso8601String(),
        ];

        $nextStatus = $stage === Order::STAGE_DELIVERED
            ? Order::STATUS_COMPLETED
            : Order::STATUS_APPROVED;

        $shippedAt = $order->shipped_at;
        if (in_array($stage, [Order::STAGE_SHIPPED, Order::STAGE_DELIVERED], true) && ! $shippedAt) {
            $shippedAt = now();
        } elseif (in_array($stage, [Order::STAGE_CURATING, Order::STAGE_PACKED], true)) {
            $shippedAt = null;
        }

        $deliveredAt = $stage === Order::STAGE_DELIVERED
            ? ($order->delivered_at ?? now())
            : null;

        $order->update([
            'status' => $nextStatus,
            'fulfillment_stage' => $stage,
            'courier_name' => $courier,
            'tracking_number' => $trackingNumber,
            'recipient_name' => $recipient,
            'shipping_notes' => $note,
            'tracking_history' => $history,
            'shipped_at' => $shippedAt,
            'delivered_at' => $deliveredAt,
        ]);

        return redirect()->back()->with(
            'success',
            "Pelacakan {$order->order_code} diperbarui: {$stageLabel}."
        );
    }
}
