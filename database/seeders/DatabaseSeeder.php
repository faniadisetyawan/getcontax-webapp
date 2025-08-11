<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\School;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $school = School::create([
            'name' => 'SMAS CAKRA BUANA',
            'npsn' => '20229150',
            'address' => 'Jl. Raya Sawangan No.91, Mampang, Kec. Pancoran Mas, Kota Depok, Jawa Barat 16433',
            'phone' => '(021) 7765620',
        ]);

        $roles = [
            ['name' => 'ketua_yayasan', 'display_name' => 'Ketua Yayasan'],
            ['name' => 'kepala_sekolah', 'display_name' => 'Kepala Sekolah'],
            ['name' => 'admin_sekolah', 'display_name' => 'Admin Sekolah'],
            ['name' => 'admin_kantin', 'display_name' => 'Admin Kantin'],
            ['name' => 'wali_murid', 'display_name' => 'Wali Murid'],
        ];

        foreach ($roles as $roleData) {
            Role::create($roleData);
        }

        // --- User Ketua Yayasan ---
        $yayasanUser = User::create([
            'school_id' => $school->id,
            'name' => 'Ketua Yayasan',
            'email' => 'yayasan@cakrabuana.sch.id',
            'password' => bcrypt('password'),
            'address' => 'Alamat Ketua Yayasan',
            'phone_number' => '081000000001',
        ]);

        $yayasanRole = Role::where('name', 'ketua_yayasan')->first();
        $yayasanUser->roles()->attach($yayasanRole);


        // --- User Kepala Sekolah ---
        $kepsekUser = User::create([
            'school_id' => $school->id,
            'name' => 'Kepala Sekolah',
            'email' => 'kepsek@cakrabuana.sch.id',
            'password' => bcrypt('password'),
            'address' => 'Alamat Kepala Sekolah',
            'phone_number' => '081000000002',
        ]);

        $kepsekRole = Role::where('name', 'kepala_sekolah')->first();
        $kepsekUser->roles()->attach($kepsekRole);


        // --- User Admin Sekolah ---
        $adminUser = User::create([
            'school_id' => $school->id,
            'name' => 'Admin Sekolah',
            'email' => 'adminsekolah@cakrabuana.sch.id',
            'password' => bcrypt('password'),
            'address' => 'Alamat Admin Sekolah',
            'phone_number' => '081000000003',
        ]);

        $adminRole = Role::where('name', 'admin_sekolah')->first();
        $adminUser->roles()->attach($adminRole);

        // --- User Admin Kantin ---
        $kantinUser = User::create([
            'school_id' => $school->id,
            'name' => 'Admin Kantin',
            'email' => 'adminkantin@cakrabuana.sch.id',
            'password' => bcrypt('password'),
            'address' => 'Alamat Admin Kantin',
            'phone_number' => '081000000004',
        ]);

        $kantinRole = Role::where('name', 'admin_kantin')->first();
        $kantinUser->roles()->attach($kantinRole);

        // --- User Wali Murid ---
        $waliUser = User::create([
            'school_id' => $school->id,
            'name' => 'Wali Murid',
            'email' => 'walimurid@cakrabuana.sch.id',
            'password' => bcrypt('password'),
            'address' => 'Alamat Wali Murid',
            'phone_number' => '081000000005',
        ]);

        $waliRole = Role::where('name', 'wali_murid')->first();
        $waliUser->roles()->attach($waliRole);
    }
}
