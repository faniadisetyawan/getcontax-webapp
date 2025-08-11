<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    protected $fillable = [
        'npsn',
        'name',
        'address',
        'phone',
        'logo',
    ];

    public function logoUrl(): Attribute
    {
        return Attribute::get(function () {
            if (is_null($this->logo)) {
                return asset("assets/blank-image.svg");
            } else {
                return asset("storage/schools/{$this->id}/{$this->logo}");
            }
        });
    }
}
