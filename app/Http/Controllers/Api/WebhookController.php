<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function handleBankTransfer(Request $request)
    {
        $vaNumber = $request->input('virtual_account');
        $amount = $request->input('amount');
        $bankTransactionId = $request->input('transaction_id');
        $description = $request->input('description');

        $student = Student::where('va_number', $vaNumber)->first();
        // return response()->json($student);

        if (!$student) {
            Log::warning('Webhook diterima untuk VA yang tidak terdaftar: ' . $vaNumber);
            return response()->json(['status' => 'ignored', 'message' => 'VA not found']);
        }

        try {
            DB::transaction(function () use ($student, $amount, $bankTransactionId, $description) {
                $balanceBefore = $student->balance;

                $student->increment('balance', $amount);

                $student->financialHistories()->create([
                    'school_id' => $student->school_id,
                    'transaction_code' => $bankTransactionId, 
                    'type' => 'credit',
                    'amount' => $amount,
                    'description' => $description ?: 'Top-up via Bank Transfer',
                    'balance_before' => $balanceBefore,
                    'balance_after' => $student->fresh()->balance,
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Gagal memproses webhook VA: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Internal Server Error'], 500);
        }

        return response()->json(['status' => 'success']);
    }
}
