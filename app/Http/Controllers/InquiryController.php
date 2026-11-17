<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInquiryRequest;
use App\Mail\InquiryReceivedMail;
use App\Models\Inquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class InquiryController extends Controller
{
    /**
     * Store a newly created corporate inquiry in storage.
     */
    public function store(StoreInquiryRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        unset($validated['website']);

        $inquiry = Inquiry::create($validated);

        try {
            $adminEmail = config('mail.from.address', 'admin@galuh.co.id');
            Mail::to($adminEmail)->send(new InquiryReceivedMail($inquiry));
        } catch (\Throwable $e) {
            Log::error('Gagal mengirim email notifikasi inquiry: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Terima kasih atas permintaan penawaran Anda! Tim konsultan gifting GALUH & CO. akan segera menghubungi Anda dalam 1x24 jam.');
    }
}
