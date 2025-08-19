<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reg_id' => $this->reg_id,
            'school_id' => $this->school_id,
            'school' => new SchoolResource($this->school),
            'nisn' => $this->nisn,
            'nis_nipd' => $this->nis_nipd,
            'name' => $this->name,
            'rfid_uid' => $this->rfid_uid,
            'va_number' => $this->va_number,
            'balance' => $this->balance,
            'gender' => $this->gender,
            'birth_place' => $this->birth_place,
            'birth_date' => $this->birth_date,
            'entry_year' => $this->entry_year,
            'status' => $this->status,
            'pivot' => $this->whenPivotLoaded('student_guardian', function () {
                return [
                    'relationship_type' => $this->pivot->relationship_type,
                ];
            }),
        ];
    }
}
