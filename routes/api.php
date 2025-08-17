<?php

use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CanteenController;
use App\Http\Controllers\Api\GuardianController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\WebhookController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/guardian/children', [GuardianController::class, 'getMyChildren'])->middleware('role:wali_murid');
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::get('/settings', [SettingController::class, 'index']);

Route::prefix('attendances')->group(function () {
    Route::get('daily', [AttendanceController::class, 'daily'])->middleware('auth:sanctum');
    Route::post('tap', [AttendanceController::class, 'tap']);
});

Route::post('/webhooks/bank-transfer-handler', [WebhookController::class, 'handleBankTransfer']);
Route::post('/canteen/checkout', [CanteenController::class, 'checkout'])->name('api.canteen.checkout');
Route::post('/canteen/check-balance', [CanteenController::class, 'checkBalance'])->name('api.canteen.check-balance');
