<?php

namespace Database\Seeders;

use App\Models\Contact;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class ContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            [
                'phone_number' => fake()->numerify('0812########'),
                'name' => fake()->name(),
                'avatar' => '1.jpg',
                'status_id' => 1,
            ],
            [
                'phone_number' => fake()->numerify('0822########'),
                'name' => fake()->name(),
                'avatar' => '2.jpg',
                'status_id' => 2,
            ],
            [
                'phone_number' => fake()->numerify('0856########'),
                'name' => fake()->name(),
                'avatar' => '3.jpg',
                'status_id' => 3,
            ],
            [
                'phone_number' => fake()->numerify('087#########'),
                'name' => fake()->name(),
                'avatar' => '4.jpg',
                'status_id' => 1,
            ],
        ];

        File::makeDirectory(public_path('storage/contacts'), 0777, true, true);

        foreach ($items as $item) {
            $created = Contact::create($item);

            $fromPath = public_path("assets/dummy/{$created->avatar}");
            $toPath = public_path("storage/contacts/{$created->avatar}");
            File::copy($fromPath, $toPath);
        }
    }
}
