<?php

namespace Database\Seeders;

use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $start = Carbon::today()->subMonth();
        $end = Carbon::today();

        $date = $start->copy();

        while ($date->lte($end)) {
            if (!in_array($date->dayOfWeek, [Carbon::SATURDAY, Carbon::SUNDAY])) {
                $checkIn = fake()->dateTimeBetween(
                    $date->copy()->setTime(6, 30),
                    $date->copy()->setTime(8, 0)
                );

                $checkOut = fake()->dateTimeBetween(
                    $date->copy()->setTime(15, 0),
                    $date->copy()->setTime(17, 0)
                );

                Attendance::create([
                    'student_id' => 1,
                    'date' => $date->format('Y-m-d'),
                    'time_in' => $checkIn,
                    'time_out' => $checkOut,
                    'status' => 'Tepat waktu',
                ]);
            }

            $date->addDay();
        }
    }
}
