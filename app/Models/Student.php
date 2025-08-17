<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Student extends Model
{
    protected $fillable = [
        'school_id',
        'reg_id',
        'nisn',
        'nis_nipd',
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

    protected function casts(): array
    {
        return [
            'balance' => 'float',
            'entry_year' => 'integer',
        ];
    }

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
