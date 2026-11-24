<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminInquiryController extends Controller
{
    /**
     * Display corporate gifting inquiries submitted from the landing page.
     */
    public function index(): Response
    {
        return Inertia::render('admin/inquiries', [
            'inquiries' => Inquiry::query()->latest()->get(),
        ]);
    }

    /**
     * Delete an inquiry record.
     */
    public function destroy(Inquiry $inquiry): RedirectResponse
    {
        $inquiry->delete();

        return redirect()->back()->with('success', 'Data inquiry berhasil dihapus.');
    }
}
