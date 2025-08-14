<?php

namespace App\Http\Controllers;

use App\Http\Resources\WithdrawalResource;
use App\Models\CanteenWithdrawal;
use App\Models\FinancialHistory;
use App\Models\ProductOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CanteenFinanceController extends Controller
{
    public function index(Request $request)
    {

        $search = $request->query('search');
        $sort = $request->query('sort', 'created_at');
        $order = $request->query('order', 'asc');
        $perPage = $request->query('per_page', 10);

        $query = CanteenWithdrawal::query();
        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('barcode', 'like', "%{$search}%");
        }
        $query->orderBy($sort, $order);
        $resource = $query->paginate($perPage);
        $withdrawalHistories = WithdrawalResource::collection($resource);

        $totalSales = FinancialHistory::where('type', 'debit')
            ->where('sourceable_type', ProductOrder::class)
            ->sum('amount');

        $totalWithdrawals = CanteenWithdrawal::sum('amount');

        $availableBalance = $totalSales - $totalWithdrawals;
        return Inertia::render('finance/index', [
            'metaOptions' => ['title' => 'Keuangan Kantin'],
            'stats' => [
                'total_sales' => (float) $totalSales,
                'total_withdrawals' => (float) $totalWithdrawals,
                'available_balance' => (float) $availableBalance,
            ],
            'withdrawalHistories' => $withdrawalHistories,
        ]);
    }

    public function withdraw(Request $request)
    {
        $totalSales = FinancialHistory::where('type', 'debit')->where('sourceable_type', ProductOrder::class)->sum('amount');
        $totalWithdrawals = CanteenWithdrawal::sum('amount');
        $availableBalance = $totalSales - $totalWithdrawals;

        $request->validate([
            'amount' => 'required|numeric|min:1|max:' . $availableBalance,
            'notes' => 'nullable|string',
        ]);

        CanteenWithdrawal::create([
            'school_id' => Auth::user()->school_id,
            'user_id' => Auth::id(),
            'amount' => $request->amount,
            'withdrawal_date' => now(),
            'notes' => $request->notes,
        ]);

        return back()->with('success', 'Penarikan dana berhasil dicatat.');
    }
}
