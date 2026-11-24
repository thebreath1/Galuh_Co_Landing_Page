<?php

use App\Http\Controllers\Admin\AdminContentController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminInquiryController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminTestimonialController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingPageController::class, 'index'])->name('home');

Route::post('/orders', [OrderController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('orders.store');

Route::post('/inquiries', [InquiryController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('inquiries.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::redirect('admin', '/dashboard')->name('admin.index');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('pesanan', [AdminOrderController::class, 'index'])->name('orders.index');
        Route::patch('pesanan/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.updateStatus');
        Route::delete('pesanan/{order}', [AdminOrderController::class, 'destroy'])->name('orders.destroy');

        Route::get('katalog', [AdminProductController::class, 'index'])->name('products.index');
        Route::post('katalog', [AdminProductController::class, 'store'])->name('products.store');
        Route::post('katalog/{product}', [AdminProductController::class, 'update'])->name('products.update');
        Route::patch('katalog/{product}/toggle', [AdminProductController::class, 'toggle'])->name('products.toggle');
        Route::delete('katalog/{product}', [AdminProductController::class, 'destroy'])->name('products.destroy');

        Route::get('testimoni', [AdminTestimonialController::class, 'index'])->name('testimonials.index');
        Route::post('testimoni', [AdminTestimonialController::class, 'store'])->name('testimonials.store');
        Route::put('testimoni/{testimonial}', [AdminTestimonialController::class, 'update'])->name('testimonials.update');
        Route::patch('testimoni/{testimonial}/toggle', [AdminTestimonialController::class, 'toggle'])->name('testimonials.toggle');
        Route::delete('testimoni/{testimonial}', [AdminTestimonialController::class, 'destroy'])->name('testimonials.destroy');

        Route::get('konten', [AdminContentController::class, 'index'])->name('content.index');
        Route::post('konten', [AdminContentController::class, 'update'])->name('content.update');

        Route::get('inquiry', [AdminInquiryController::class, 'index'])->name('inquiries.index');
        Route::delete('inquiry/{inquiry}', [AdminInquiryController::class, 'destroy'])->name('inquiries.destroy');
    });
});

require __DIR__.'/settings.php';
