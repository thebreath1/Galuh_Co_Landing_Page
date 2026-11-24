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
     * Display all incoming customer orders for monitoring and approval (ACC).
     */
    public function index(): Response
    {
        $orders = Order::query()
            ->with(['product:id,name,image,category', 'reviewer:id,name'])
            ->latest()
            ->get();

        return Inertia::render('admin/orders', [
            'orders' => $orders,
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

        $order->update([
            'status' => $validated['status'],
            'admin_note' => array_key_exists('admin_note', $validated)
                ? ($validated['admin_note'] ?: null)
                : $order->admin_note,
            'reviewed_by' => $request->user()?->id,
            'reviewed_at' => now(),
        ]);

        $message = match ($validated['status']) {
            Order::STATUS_APPROVED => "Pesanan {$order->order_code} berhasil di-ACC.",
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
