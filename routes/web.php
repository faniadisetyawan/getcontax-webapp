<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\CanteenFinanceController;
use App\Http\Controllers\CanteenPOSController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\FinancialManagementController;
use App\Http\Controllers\GuardianController;
use App\Http\Controllers\KioskController;
use App\Http\Controllers\LabelController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SchoolClassController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return to_route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    //Admin Sekolah
    Route::middleware('role:admin_sekolah')->group(function () {
        Route::prefix('master')->as('master.')->group(function () {
            Route::resource('schools', SchoolController::class)->names('schools');
            Route::get('/students/import', [StudentController::class, 'showImportForm'])->name('students.import.form');
            Route::post('/students/import', [StudentController::class, 'import'])->name('students.import');
            Route::get('/students/template/download', [StudentController::class, 'downloadTemplate'])->name('students.template.download');
            Route::post('/students/{student}/register-card', [StudentController::class, 'registerCard'])->name('students.register-card');
            Route::resource('students', StudentController::class)->names('students');
            Route::resource('guardians', GuardianController::class)->names('guardians');
            Route::resource('classes', SchoolClassController::class)->names('classes');
        });
        Route::resource('attendances', AttendanceController::class)->names('attendances')->only(['index', 'destroy']);
    });

    //Wali Murid, sepertinya tidak perlu karena hanya mengakses API untuk aplikasi mobile
    Route::prefix('guardians')->as('guardians.')->group(function () {
        Route::resource('financials', FinancialManagementController::class)->names('financials');
    });

    //Admin Kantin
    Route::middleware('role:admin_kantin')->prefix('canteens')->as('canteens.')->group(function () {
        Route::resource('inventory', ProductController::class);
        Route::get('pos', [CanteenPOSController::class, 'index'])->name('pos.index');
        Route::post('cart/add-item', [CanteenPOSController::class, 'addItemToCart'])->name('cart.add-item');
        Route::get('label/print', [LabelController::class, 'create'])->name('print.create');
        Route::post('label/print', [LabelController::class, 'store'])->name('print.store');
    });

    //Ketua Yayasan
    Route::middleware('role:ketua_yayasan')->prefix('finance')->as('finance.')->group(function () {
        Route::get('/canteen', [CanteenFinanceController::class, 'index'])->name('canteen.index');
        Route::post('/canteen/withdraw', [CanteenFinanceController::class, 'withdraw'])->name('canteen.withdraw');
    });
});

Route::get('/check-balance-kiosk', [KioskController::class, 'showBalanceChecker'])->name('kiosk.balance');


require __DIR__ . '/auth.php';
