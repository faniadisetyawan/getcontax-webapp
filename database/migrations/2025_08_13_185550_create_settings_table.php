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
        Schema::create('settings', function (Blueprint $table) {
            $table->string('app_name');
            $table->string('app_tagline')->nullable();
            $table->text('app_description')->nullable();
            $table->string('app_version', 25)->default('1.0.0');
            $table->string('app_logo', 100);
            $table->string('mobile_splash_screen_logo', 100);
            $table->string('mobile_vector_1', 100);
            $table->string('mobile_vector_2', 100);
            $table->string('mobile_student_illustration', 100);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
