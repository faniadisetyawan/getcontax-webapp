<?php

namespace App\Http\Controllers;

use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KioskController extends Controller
{
    public function showBalanceChecker()
    {
        $school = School::first();
        return Inertia::render('kiosk/check-balance', [
            'metaOptions' => ['title' => 'Cek Saldo Siswa'],
            'school' => $school ? [
                'name' => $school->name,
                'logo_url' => $school->logo_url,
            ] : null,
        ]);
    }
}
