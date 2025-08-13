<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
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
        $validated = $request->validate([
            'rfid_uid' => 'required|string|exists:students,rfid_uid',
            'cart' => 'required|array|min:1',
            'cart.*.product_id' => 'required|integer|exists:products,id',
            'cart.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            $responseData = DB::transaction(function () use ($validated) {
                $student = Student::where('rfid_uid', $validated['rfid_uid'])->lockForUpdate()->firstOrFail();
                $cart = $validated['cart'];

                $productIds = array_column($cart, 'product_id');
                $products = Product::whereIn('id', $productIds)->lockForUpdate()->get()->keyBy('id');

                $totalAmount = 0;
                $totalItems = 0;
                $descriptionItems = [];

                foreach ($cart as $item) {
                    $product = $products[$item['product_id']];
                    if ($product->stock < $item['quantity']) {
                        throw new \Exception("Stok untuk " . $product->name . " tidak cukup!");
                    }
                    $finalPrice = max(0, $product->price - $product->discount_nominal);
                    $totalAmount += $finalPrice * $item['quantity'];
                    $totalItems += $item['quantity'];
                    $descriptionItems[] = $product->name . ' (x' . $item['quantity'] . ')';
                }

                $balanceBefore = $student->balance;
                $balanceAfter = $balanceBefore - $totalAmount;

                $order = ProductOrder::create([
                    'order_code' => 'ORD-' . now()->timestamp . '-' . $student->id,
                    'student_id' => $student->id,
                    'total_amount' => $totalAmount,
                    'total_items' => $totalItems,
                ]);

                foreach ($cart as $item) {
                    $product = $products[$item['product_id']];
                    $finalPrice = max(0, $product->price - $product->discount_nominal);
                    $order->details()->create([
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'price_at_purchase' => $finalPrice,
                    ]);
                    $product->decrement('stock', $item['quantity']);
                }

                $student->update(['balance' => $balanceAfter]);

                $student->financialHistories()->create([
                    'school_id' => $student->school_id,
                    'transaction_code' => 'PAY-' . $order->order_code,
                    'type' => 'debit',
                    'amount' => $totalAmount,
                    'description' => implode(', ', $descriptionItems),
                    'balance_before' => $balanceBefore,
                    'balance_after' => $balanceAfter,
                    'sourceable_id' => $order->id,
                    'sourceable_type' => ProductOrder::class,
                ]);

                return ['student_name' => $student->name, 'new_balance' => $balanceAfter];
            });

            return response()->json(['success' => true, 'message' => 'Pembayaran berhasil!', 'data' => $responseData]);
        } catch (\Exception $e) {
            Log::error('Gagal checkout kantin: ' . $e->getMessage());
            return response()->json(['message' => 'Transaksi Gagal: ' . $e->getMessage()], 422);
        }
    }
}
