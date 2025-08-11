<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
    
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }
}
