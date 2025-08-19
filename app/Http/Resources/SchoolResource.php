<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SchoolResource extends JsonResource
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
            'npsn' => $this->npsn,
            'name' => $this->name,
            'address' => $this->address,
            'phone' => $this->phone,
            'logo' => $this->logo,
            'logo_url' => $this->logoUrl,
            'checkin_start_time' => $this->checkin_start_time,
            'checkin_end_time' => $this->checkin_end_time,
            'checkout_start_time' => $this->checkout_start_time,
            'checkout_end_time' => $this->checkout_end_time,
        ];
    }
}
