<?php

namespace App\Http\Controllers;

use App\Models\FinancialHistory;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FinancialManagementController extends Controller
{
    public function index()
    {
        $guardian = Auth::user();
        $guardian->load('roles', 'children');
        return response()->json($guardian);
        $studentIds = $guardian->children()->pluck('id');
        $financialHistories = FinancialHistory::whereIn('student_id', $studentIds)
            ->with('student:id,name')
            ->latest()
            ->paginate(15);

        return Inertia::render('financials/index', [
            'metaOptions' => [
                'title' => 'Riwayat Transaksi Keuangan',
                'description' => 'Manajemen data transaksi keuangan siswa',
            ],
            'responseData' => $financialHistories,
        ]);
    }
}
