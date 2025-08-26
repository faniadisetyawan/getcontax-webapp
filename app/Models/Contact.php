<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contact extends Model
{
    protected $fillable = [
        'phone_number',
        'name',
        'avatar',
        'status_id',
    ];

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function avatarUrl(): Attribute
    {
        return Attribute::get(function () {
            if (is_null($this->avatar)) {
                return asset("assets/user-placeholder.png");
            } else {
                return asset("storage/contacts/{$this->avatar}");
            }
        });
    }
}
