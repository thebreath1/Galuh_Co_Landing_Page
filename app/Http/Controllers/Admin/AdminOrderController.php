<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminOrderController extends Controller
{
    /**
     * Display incoming pending/rejected orders awaiting review or ACC.
     * Approved and completed orders are managed in the dedicated Pelacakan Paket page.
     */
    public function index(): Response
    {
        $orders = Order::query()
            ->whereIn('status', [Order::STATUS_PENDING, Order::STATUS_REJECTED])
            ->with(['product:id,name,image,category,contents', 'reviewer:id,name'])
            ->latest()
            ->get();

        $activeShipmentsCount = Order::query()
            ->whereIn('status', [Order::STATUS_APPROVED, Order::STATUS_COMPLETED])
            ->count();

        return Inertia::render('admin/orders', [
            'orders' => $orders,
            'activeShipmentsCount' => $activeShipmentsCount,
        ]);
    }

    /**
     * Approve (ACC), reject, complete, or revert order status.
     */
    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(Order::STATUSES)],
            'admin_note' => ['nullable', 'string', 'max:1000'],
        ]);

        $nextStatus = $validated['status'];
        $updatePayload = [
            'status' => $nextStatus,
            'admin_note' => array_key_exists('admin_note', $validated)
                ? ($validated['admin_note'] ?: null)
                : $order->admin_note,
            'reviewed_by' => $request->user()?->id,
            'reviewed_at' => now(),
        ];

        if ($nextStatus === Order::STATUS_APPROVED && $order->status !== Order::STATUS_APPROVED) {
            $history = is_array($order->tracking_history) ? $order->tracking_history : [];
            $history[] = [
                'stage' => Order::STAGE_CURATING,
                'label' => 'Pesanan Di-ACC & Masuk Perakitan',
                'note' => ($validated['admin_note'] ?? null) ?: 'Pesanan disetujui admin dan dijadwalkan untuk dirakit.',
                'actor' => $request->user()?->name ?? 'Admin',
                'timestamp' => now()->toIso8601String(),
            ];

            $updatePayload['fulfillment_stage'] = Order::STAGE_CURATING;
            $updatePayload['tracking_history'] = $history;
        } elseif ($nextStatus === Order::STATUS_COMPLETED) {
            $updatePayload['fulfillment_stage'] = Order::STAGE_DELIVERED;
            $updatePayload['delivered_at'] = $order->delivered_at ?? now();
        }

        $order->update($updatePayload);

        $message = match ($nextStatus) {
            Order::STATUS_APPROVED => "Pesanan {$order->order_code} berhasil di-ACC dan dipindahkan ke Pelacakan Paket.",
            Order::STATUS_COMPLETED => "Pesanan {$order->order_code} ditandai selesai.",
            Order::STATUS_REJECTED => "Pesanan {$order->order_code} ditolak.",
            default => "Status pesanan {$order->order_code} dikembalikan ke menunggu ACC.",
        };

        return redirect()->back()->with('success', $message);
    }

    /**
     * Delete an order record.
     */
    public function destroy(Order $order): RedirectResponse
    {
        $code = $order->order_code;
        $order->delete();

        return redirect()->back()->with('success', "Pesanan {$code} berhasil dihapus.");
    }
}
