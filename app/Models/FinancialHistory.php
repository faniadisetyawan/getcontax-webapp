<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class FinancialHistory extends Model
{
    protected $fillable = [
        'school_id',
        'student_id',
        'transaction_code',
        'type',
        'amount',
        'description',
        'balance_before',
        'balance_after',
        'sourceable_id',
        'sourceable_type',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function sourceable(): MorphTo
    {
        return $this->morphTo();
    }
}
