<?php

use App\Http\Controllers\CanteenPOSController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\FinancialManagementController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return to_route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::prefix('master')->as('master.')->group(function () {
        Route::resource('schools', SchoolController::class)->names('schools');
    });
    Route::prefix('guardians')->as('guardians.')->group(function () {
        Route::resource('financials', FinancialManagementController::class)->names('financials');
    });
    Route::prefix('canteens')->as('canteens.')->group(function () {
        Route::get('/pos', [CanteenPOSController::class, 'index'])->name('pos.index');
        Route::resource('inventory', ProductController::class);
        // Route::post('/cart/add', [CanteenPOSController::class, 'addToCart'])->name('cart.add');
    });
});

require __DIR__ . '/auth.php';
