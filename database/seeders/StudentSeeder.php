<?php

namespace Database\Seeders;

use App\Models\School;
use App\Models\Student;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $schoolIds = School::all()->pluck('id');

        foreach ($schoolIds as $schoolId) {
            for ($i = 0; $i < 15; $i++) {
                $student = [
                    'reg_id' => $this->_generateRegId(),
                    'school_id' => $schoolId,
                    'nisn' => fake()->unique()->numerify('##########'),
                    'nis_nipd' => fake()->unique()->numerify('#########'),
                    'name' => fake()->name(),
                    'rfid_uid' => $this->_generateRfId(),
                    'va_number' => fake()->unique()->numerify('############'),
                    'balance' => $this->_generateBalance(),
                    'gender' => fake()->randomElement(['Laki-laki', 'Perempuan']),
                    'birth_place' => fake()->city(),
                    'birth_date' => fake()->dateTimeBetween('-12 years', '-7 years'),
                    'entry_year' => fake()->randomElement([2023, 2024, 2025]),
                    'status' => 'aktif',
                ];

                Student::create($student);
            }
        }
    }

    private function _generateRegId($prefix = 'C', $length = 4)
    {
        // contoh pakai tahun + minggu
        $year = now()->format('y'); // 25
        $week = now()->format('W'); // 26
        $datePart = $year . $week;  // 2526

        // nomor random dengan panjang $length
        $number = str_pad(rand(1, 9999), $length, '0', STR_PAD_LEFT);

        return $prefix . $datePart . $number;
    }

    private function _generateRfId()
    {
        $code = '';
        for ($i = 0; $i < 4; $i++) {
            $code .= fake()->randomLetter() . fake()->randomDigit();
        }
        return strtoupper($code);
    }

    private function _generateBalance(int $min = 50000, int $max = 800000): int
    {
        // pastikan min & max kelipatan 50,000
        $minMultiplier = intval($min / 50000);
        $maxMultiplier = intval($max / 50000);

        $randomMultiplier = rand($minMultiplier, $maxMultiplier);

        return $randomMultiplier * 50000;
    }
}
