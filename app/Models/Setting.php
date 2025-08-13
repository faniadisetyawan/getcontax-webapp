<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $primaryKey = null;
    public $incrementing = false;

    protected $fillable = [
        'app_name',
        'app_tagline',
        'app_description',
        'app_version',
        'app_logo',
        'mobile_splash_screen_logo',
        'mobile_vector_1',
        'mobile_vector_2',
        'mobile_student_illustration',
    ];

    public function getKeyName()
    {
        return null;
    }

    public function appLogoUrl(): Attribute
    {
        return Attribute::get(function () {
            if (is_null($this->app_logo)) {
                return asset("assets/blank-image.svg");
            } else {
                return asset("storage/{$this->app_logo}");
            }
        });
    }

    public function mobileSplashScreenLogoUrl(): Attribute
    {
        return Attribute::get(function () {
            if (is_null($this->mobile_splash_screen_logo)) {
                return asset("assets/blank-image.svg");
            } else {
                return asset("storage/mobile/{$this->mobile_splash_screen_logo}");
            }
        });
    }

    public function mobileVector1Url(): Attribute
    {
        return Attribute::get(function () {
            if (is_null($this->mobile_vector_1)) {
                return asset("assets/blank-image.svg");
            } else {
                return asset("storage/mobile/{$this->mobile_vector_1}");
            }
        });
    }

    public function mobileVector2Url(): Attribute
    {
        return Attribute::get(function () {
            if (is_null($this->mobile_vector_2)) {
                return asset("assets/blank-image.svg");
            } else {
                return asset("storage/mobile/{$this->mobile_vector_2}");
            }
        });
    }

    public function mobileStudentIllustrationUrl(): Attribute
    {
        return Attribute::get(function () {
            if (is_null($this->mobile_student_illustration)) {
                return asset("assets/blank-image.svg");
            } else {
                return asset("storage/mobile/{$this->mobile_student_illustration}");
            }
        });
    }
}
