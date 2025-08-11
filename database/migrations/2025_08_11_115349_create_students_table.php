<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->char('nisn', 10)->unique();
            $table->string('name');
            $table->string('rfid_uid')->unique()->nullable();
            $table->string('va_number')->unique()->nullable();
            $table->decimal('balance', 15, 2)->default(0);
            $table->enum('gender', ['Laki-laki', 'Perempuan'])->nullable();
            $table->string('birth_place')->nullable();
            $table->date('birth_date')->nullable();
            $table->year('entry_year')->nullable();
            $table->enum('status', ['aktif', 'lulus', 'pindah', 'dikeluarkan'])->default('aktif');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
