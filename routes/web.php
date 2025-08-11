<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SchoolController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return to_route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::prefix('master')->as('master.')->group(function () {
        Route::resource('schools', SchoolController::class)->names('schools');
    });
});

require __DIR__ . '/auth.php';
