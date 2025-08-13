<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SettingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'app_name' => $this->app_name,
            'app_tagline' => $this->app_tagline,
            'app_description' => $this->app_description,
            'app_version' => $this->app_version,
            'app_logo' => $this->app_logo,
            'app_logo_url' => $this->appLogoUrl,
            'mobile_splash_screen_logo' => $this->mobile_splash_screen_logo,
            'mobile_splash_screen_logo_url' => $this->mobileSplashScreenLogoUrl,
            'mobile_vector_1' => $this->mobile_vector_1,
            'mobile_vector_1_url' => $this->mobileVector1Url,
            'mobile_vector_2' => $this->mobile_vector_2,
            'mobile_vector_2_url' => $this->mobileVector2Url,
            'mobile_student_illustration' => $this->mobile_student_illustration,
            'mobile_student_illustration_url' => $this->mobileStudentIllustrationUrl,
        ];
    }
}
