<?php

namespace Database\Seeders;

use App\Models\FinancialHistory;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FinancialHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $start = Carbon::today()->subMonth();
        $end   = Carbon::today();

        $date = $start->copy();
        $balance = 0;

        while ($date->lte($end)) {
            // hanya hari sekolah (Senin–Jumat)
            if (in_array($date->dayOfWeek, [
                Carbon::MONDAY,
                Carbon::TUESDAY,
                Carbon::WEDNESDAY,
                Carbon::THURSDAY,
                Carbon::FRIDAY
            ])) {
                // === CREDIT (Setoran rutin) hanya Senin & Kamis ===
                if (in_array($date->dayOfWeek, [Carbon::MONDAY, Carbon::THURSDAY])) {
                    $amount = fake()->numberBetween(50000, 200000);

                    $balanceBefore = $balance;
                    $balanceAfter  = $balanceBefore + $amount;
                    $balance       = $balanceAfter;

                    FinancialHistory::create([
                        'school_id'        => 1,
                        'student_id'       => 1,
                        'transaction_code' => strtoupper('CRD' . $date->format('Ymd') . fake()->unique()->randomNumber(5)),
                        'type'             => 'credit',
                        'amount'           => $amount,
                        'description'      => 'Topup hari ' . $date->format('l'),
                        'balance_before'   => $balanceBefore,
                        'balance_after'    => $balanceAfter,
                    ]);
                }

                // === DEBIT (Jajan kantin) setiap hari sekolah ===
                $amount = fake()->numberBetween(5000, 30000);
                $balanceBefore = $balance;
                $balanceAfter  = max(0, $balanceBefore - $amount); // tidak boleh minus
                $balance       = $balanceAfter;

                FinancialHistory::create([
                    'school_id'        => 1,
                    'student_id'       => 1,
                    'transaction_code' => strtoupper('DBT' . $date->format('Ymd') . fake()->unique()->randomNumber(5)),
                    'type'             => 'debit',
                    'amount'           => $amount,
                    'description'      => 'Jajan kantin',
                    'balance_before'   => $balanceBefore,
                    'balance_after'    => $balanceAfter,
                ]);
            }

            $date->addDay();
        }
    }
}
