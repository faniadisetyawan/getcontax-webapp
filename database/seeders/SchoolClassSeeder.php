<?php

namespace Database\Seeders;

use App\Models\School;
use App\Models\SchoolClass;
use Illuminate\Database\Seeder;

class SchoolClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil sekolah pertama yang ada di database untuk dihubungkan
        $school = School::first();

        if (!$school) {
            $this->command->error('Tidak ada data sekolah. Silakan jalankan SchoolSeeder terlebih dahulu.');
            return;
        }

        // Daftar kelas yang akan dibuat
        $classes = [
            // Kelas 10
            ['name' => '10-A', 'level' => '10'],
            ['name' => '10-B', 'level' => '10'],
            ['name' => '10-C', 'level' => '10'],

            // Kelas 11
            ['name' => '11 IPA 1', 'level' => '11'],
            ['name' => '11 IPA 2', 'level' => '11'],
            ['name' => '11 IPS 1', 'level' => '11'],

            // Kelas 12
            ['name' => '12 IPA 1', 'level' => '12'],
            ['name' => '12 IPS 1', 'level' => '12'],
        ];

        // Looping untuk membuat setiap kelas dan menghubungkannya dengan sekolah
        foreach ($classes as $classData) {
            SchoolClass::create([
                'school_id' => $school->id,
                'name' => $classData['name'],
                'level' => $classData['level'],
            ]);
        }
    }
}