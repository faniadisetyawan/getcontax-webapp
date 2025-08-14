<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CanteenWithdrawal extends Model
{
    protected $fillable = [
        'school_id',
        'user_id',
        'amount',
        'withdrawal_date',
        'notes'
    ];

    // Relasi ke user yang melakukan penarikan
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected $casts = [
        'withdrawal_date' => 'datetime',
    ];
}
