<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {

        $user = Auth::user();

        if ($user->hasRole('wali_murid')) {

            $children = $user->children()
                ->with(['attendances' => function ($query) {
                    $query->latest()->limit(10);
                }, 'financialHistories' => function ($query) {
                    $query->latest()->limit(10);
                }])
                ->get()
                ->map(function ($child) {
                    // Pastikan selalu array, meski kosong
                    $child->attendances = $child->attendances ?? [];
                    $child->financialHistories = $child->financialHistories ?? [];
                    return $child;
                });
            return Inertia::render('guardians/dashboard', [
                'metaOptions' => ['title' => 'Dashboard Wali Murid'],
                'childrenData' => $children,
            ]);
        }

        if ($user->hasRole('admin_sekolah')) {
            return Inertia::render('admin/dashboard', [
                'metaOptions' => ['title' => 'Dashboard Admin'],
                // 'stats' => ['total_students' => $totalStudents, 'total_guardians' => $totalGuardians],
            ]);
        }

        return Inertia::render('dashboard', [
            'metaOptions' => ['title' => 'Dashboard'],
        ]);
    }
}
