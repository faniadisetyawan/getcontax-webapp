<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Setting::create([
            'app_name' => 'Cakra Buana',
            'app_tagline' => 'Integrity, Skill, Collaboration',
            'app_description' => 'Setiap anak cerdas, setiap anak istimewa, dibidangnya masing-masing sesuai ciptaan yang Mahakuasa',
            'app_version' => '1.0.0',
            'app_logo' => 'logo.png',
            'mobile_splash_screen_logo' => 'logo_splash_screen.png',
            'mobile_vector_1' => 'vector_1.png',
            'mobile_vector_2' => 'vector_2.png',
            'mobile_student_illustration' => 'student_illustration.png',
        ]);

        $fromPathLogo = public_path('assets/logo.png');
        $toPathLogo = public_path('storage/logo.png');
        File::copy($fromPathLogo, $toPathLogo);

        File::makeDirectory(public_path('storage/mobile'), 0777, true, true);

        $fromPathMobileSplashScreen = public_path('assets/dummy/logo_splash_screen.png');
        $toPathMobileSplashScreen = public_path('storage/mobile/logo_splash_screen.png');
        File::copy($fromPathMobileSplashScreen, $toPathMobileSplashScreen);

        $fromPathMobileVector1 = public_path('assets/dummy/vector_1.png');
        $toPathMobileVector1 = public_path('storage/mobile/vector_1.png');
        File::copy($fromPathMobileVector1, $toPathMobileVector1);

        $fromPathMobileVector2 = public_path('assets/dummy/vector_2.png');
        $toPathMobileVector2 = public_path('storage/mobile/vector_2.png');
        File::copy($fromPathMobileVector2, $toPathMobileVector2);

        $fromPathMobileStudentIllustration = public_path('assets/dummy/student_illustration.png');
        $toPathMobileStudentIllustration = public_path('storage/mobile/student_illustration.png');
        File::copy($fromPathMobileStudentIllustration, $toPathMobileStudentIllustration);
    }
}
