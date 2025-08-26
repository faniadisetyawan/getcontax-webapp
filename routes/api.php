<?php

use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\StatusController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return abort(403);
});

Route::get('statuses', [StatusController::class, 'index']);
Route::apiResource('contacts', ContactController::class);
