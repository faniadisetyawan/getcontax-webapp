<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\FinancialHistory;
use App\Models\ProductOrder;
use App\Models\School;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Data untuk Card (Ringkasan)
        $totalStudents = Student::where('status', 'aktif')->count();
        $totalSchools = School::count();
        $totalRevenue = ProductOrder::sum('total_amount');

        // 1. Mengambil data untuk chart Pesanan Produk (Product Orders)
        // Mengambil 10 pesanan produk terbaru dan menghitung total item
        $productOrders = ProductOrder::latest()->take(10)->get();
        $productOrderData = $productOrders->map(function ($order, $index) {
            return [
                'name' => 'Pesanan ' . ($index + 1),
                'y' => $order->total_items,
            ];
        });

        // 2. Mengambil data untuk chart Kehadiran Siswa (Attendance)
        // Menghitung jumlah status kehadiran dari 30 hari terakhir
        $attendanceData = Attendance::where('date', '>=', now()->subDays(30))
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->get();

        $attendanceChartData = $attendanceData->map(function ($item) {
            // Menentukan warna berdasarkan status
            $color = '#6c757d'; // Default abu-abu
            if ($item->status === 'Tepat Waktu') {
                $color = '#28a745'; // Hijau
            } elseif ($item->status === 'Sakit') {
                $color = '#ffc107'; // Kuning
            } elseif ($item->status === 'Terlambat') {
                $color = '#dc3545'; // Merah
            }

            return [
                'name' => ucfirst($item->status),
                'y' => $item->count,
                'color' => $color,
            ];
        });

        // 3. Mengambil data untuk chart Riwayat Saldo Keuangan (Financial History)
        // Mengambil data saldo siswa terbaru
        // Catatan: Ini contoh sederhana, Anda mungkin perlu memodifikasi query ini
        // untuk mengambil data yang lebih spesifik per siswa atau per periode waktu
        $financialHistoryData = FinancialHistory::latest()->take(10)->get()->sortBy('id');
        $balanceData = $financialHistoryData->pluck('balance_after')->toArray();
        $balanceCategories = $financialHistoryData->pluck('created_at')->map(function ($date) {
            return $date->format('M d'); // Format tanggal: Jan 01
        })->toArray();

        // Mengirimkan data ke komponen React menggunakan Inertia
        return Inertia::render('dashboard', [
            'metaOptions' => [
                'title' => 'Dashboard',
            ],
            'totalStudents' => $totalStudents,
            'totalSchools' => $totalSchools,
            'totalRevenue' => $totalRevenue,
            'productOrderData' => $productOrderData,
            'attendanceData' => $attendanceChartData,
            'financialHistoryData' => [
                'categories' => $balanceCategories,
                'series' => [
                    [
                        'name' => 'Saldo Siswa',
                        'data' => $balanceData
                    ]
                ]
            ],
        ]);
    }
}
