<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'AdminDEV',
            'email' => 'admin@getcontax.com',
            'password' => Hash::make('P4ssw0rd'),
        ]);

        $this->call([
            StatusSeeder::class,
            ContactSeeder::class,
        ]);
    }
}
