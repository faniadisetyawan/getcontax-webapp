<?php

namespace Database\Seeders;

use App\Models\Status;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            ['name' => 'Aman'],
            ['name' => 'Spam'],
            ['name' => 'Penipuan'],
        ];

        foreach ($items as $item) {
            Status::create($item);
        }
    }
}
