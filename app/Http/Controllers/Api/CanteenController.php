<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\ProductOrder;
use App\Models\Student;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CanteenController extends Controller
{
    public function checkout(Request $request)
    {
        $request->validate(['rfid_uid' => 'required|string']);

        try {
            $responseData = DB::transaction(function () use ($request) {

                $student = Student::where('rfid_uid', $request->rfid_uid)->lockForUpdate()->firstOrFail();

                $cartItems = CartItem::where('student_id', $student->id)->with('product')->lockForUpdate()->get();

                if ($cartItems->isEmpty()) {
                    throw new \Exception('Keranjang belanja kosong!');
                }

                $totalAmount = 0;
                $descriptionItems = [];
                foreach ($cartItems as $item) {
                    $finalPricePerItem = max(0, $item->product->price - $item->product->discount_nominal);
                    $totalAmount += $finalPricePerItem * $item->quantity;
                    $descriptionItems[] = $item->product->name . ' (x' . $item->quantity . ')';
                }
                $totalItems = $cartItems->sum('quantity');
                $description = implode(', ', $descriptionItems);
                $balanceBefore = $student->balance;

                $balanceAfter = $balanceBefore - $totalAmount;

                foreach ($cartItems as $item) {
                    if ($item->product->stock < $item->quantity) {
                        throw new \Exception("Stok untuk " . $item->product->name . " tidak cukup!");
                    }
                }

                $order = ProductOrder::create([
                    'order_code' => 'ORD-' . now()->timestamp . '-' . $student->id,
                    'student_id' => $student->id,
                    'total_amount' => $totalAmount,
                    'total_items' => $totalItems,
                ]);

                foreach ($cartItems as $item) {
                    $finalPricePerItem = max(0, $item->product->price - $item->product->discount_nominal);
                    $order->details()->create([
                        'product_id' => $item->product_id,
                        'quantity' => $item->quantity,
                        'price_at_purchase' => $finalPricePerItem,
                    ]);
                    $item->product->decrement('stock', $item->quantity);
                }

                $student->balance = $balanceAfter;
                $student->save();

                $student->financialHistories()->create([
                    'school_id' => $student->school_id,
                    'transaction_code' => 'PAY-' . $order->order_code,
                    'type' => 'debit',
                    'amount' => $totalAmount,
                    'description' => $description,
                    'balance_before' => $balanceBefore,
                    'balance_after' => $balanceAfter,
                    'sourceable_id' => $order->id,
                    'sourceable_type' => ProductOrder::class,
                ]);

                CartItem::where('student_id', $student->id)->delete();

                return [
                    'student_name' => $student->name,
                    'items_purchased' => $description,
                    'total_spent' => $totalAmount,
                    'new_balance' => $balanceAfter,
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Pembayaran berhasil!',
                'data' => $responseData
            ]);
        } catch (QueryException $e) {
            Log::error('Gagal checkout kantin (DB): ' . $e->getMessage());
            return response()->json(['message' => 'Transaksi Gagal: Terjadi masalah pada database.'], 500);
        } catch (\Exception $e) {
            Log::error('Gagal checkout kantin: ' . $e->getMessage());
            return response()->json(['message' => 'Transaksi Gagal: ' . $e->getMessage()], 422);
        }
    }
}
