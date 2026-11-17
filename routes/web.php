<?php

use App\Http\Controllers\InquiryController;
use App\Http\Controllers\LandingPageController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingPageController::class, 'index'])->name('home');

Route::post('/inquiries', [InquiryController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('inquiries.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
