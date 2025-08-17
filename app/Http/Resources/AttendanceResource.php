<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
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
            'student_id' => $this->student_id,
            'date' => $this->date,
            'time_in' => $this->time_in ? date('H:i', strtotime($this->time_in)) : null,
            'time_out' => $this->time_out ? date('H:i', strtotime($this->time_out)) : null,
            'status' => $this->status,
            'remarks' => $this->remarks,
            'student' => new StudentResource($this->whenLoaded('student')),
        ];
    }
}
