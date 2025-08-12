<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    protected $fillable = [
        'nisn',
        'name',
        'rfid_uid',
        'va_number',
        'balance',
        'gender',
        'birth_place',
        'birth_date',
        'entry_year',
        'status',
    ];

    public function guardians(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'student_guardian')
            ->withPivot('relationship_type')
            ->withTimestamps();
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function financialHistories(): HasMany
    {
        return $this->hasMany(FinancialHistory::class);
    }
}
