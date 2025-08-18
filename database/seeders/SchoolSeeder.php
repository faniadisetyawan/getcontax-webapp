<?php

namespace Database\Seeders;

use App\Models\School;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class SchoolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $schools = [
            [
                'npsn' => '69973820',
                'name' => 'PG CAKRA BUANA SCHOOL',
                'address' => 'Jl. Raya Sawangan No.91, Mampang, Kec. Pancoran Mas, Kota Depok',
                'phone' => '(021) 7765620',
                'logo' => 'logo-cakrabuana.png',
                'checkin_start_time' => '06:30:00',
                'checkin_end_time' => '08:00:00',
                'checkout_start_time' => '15:00:00',
                'checkout_end_time' => '17:00:00',
            ],
            [
                'npsn' => '20266581',
                'name' => 'TK CAKRA BUANA SCHOOL',
                'address' => 'Jl. Raya Sawangan No.91, Mampang, Kec. Pancoran Mas, Kota Depok',
                'phone' => '(021) 7765620',
                'logo' => 'logo-cakrabuana.png',
                'checkin_start_time' => '06:30:00',
                'checkin_end_time' => '08:00:00',
                'checkout_start_time' => '15:00:00',
                'checkout_end_time' => '17:00:00',
            ],
            [
                'npsn' => '20232508',
                'name' => 'SD CAKRA BUANA SCHOOL',
                'address' => 'Jl. Raya Sawangan No.91, Mampang, Kec. Pancoran Mas, Kota Depok',
                'phone' => '(021) 7765620',
                'logo' => 'logo-cakrabuana.png',
                'checkin_start_time' => '06:30:00',
                'checkin_end_time' => '08:00:00',
                'checkout_start_time' => '15:00:00',
                'checkout_end_time' => '17:00:00',
            ],
            [
                'npsn' => '20229016',
                'name' => 'SMP CAKRA BUANA SCHOOL',
                'address' => 'Jl. Raya Sawangan No.91, Mampang, Kec. Pancoran Mas, Kota Depok',
                'phone' => '(021) 7765620',
                'logo' => 'logo-cakrabuana.png',
                'checkin_start_time' => '06:30:00',
                'checkin_end_time' => '08:00:00',
                'checkout_start_time' => '15:00:00',
                'checkout_end_time' => '17:00:00',
            ],
            [
                'npsn' => '20101331',
                'name' => 'SMA CAKRA BUANA SCHOOL',
                'address' => 'Jl. Raya Sawangan No.91, Mampang, Kec. Pancoran Mas, Kota Depok',
                'phone' => '(021) 7765620',
                'logo' => 'logo-cakrabuana.png',
                'checkin_start_time' => '06:30:00',
                'checkin_end_time' => '08:00:00',
                'checkout_start_time' => '15:00:00',
                'checkout_end_time' => '17:00:00',
            ],
            [
                'npsn' => '20229011',
                'name' => 'SMP BINTARA',
                'address' => 'Jl. Raya Sawangan No.19, Pancoran Mas, Kec. Pancoran Mas, Kota Depok',
                'phone' => '(021) 7776970',
                'logo' => 'logo-bintara.png',
                'checkin_start_time' => '06:30:00',
                'checkin_end_time' => '08:00:00',
                'checkout_start_time' => '15:00:00',
                'checkout_end_time' => '17:00:00',
            ],
            [
                'npsn' => '20268528',
                'name' => 'SMA BINTARA',
                'address' => 'Jl. Raya Sawangan No.19, Pancoran Mas, Kec. Pancoran Mas, Kota Depok',
                'phone' => '(021) 7776970',
                'logo' => 'logo-bintara.png',
                'checkin_start_time' => '06:30:00',
                'checkin_end_time' => '08:00:00',
                'checkout_start_time' => '15:00:00',
                'checkout_end_time' => '17:00:00',
            ],
        ];

        File::makeDirectory(public_path('storage/schools'), 0777, true, true);

        foreach ($schools as $school) {
            $created = School::create($school);

            File::makeDirectory(public_path("storage/schools/{$created->id}"), 0777, true, true);
            $fromPath = public_path("assets/dummy/{$created->logo}");
            $toPath = public_path("storage/schools/{$created->id}/{$created->logo}");
            File::copy($fromPath, $toPath);
        }
    }
}
