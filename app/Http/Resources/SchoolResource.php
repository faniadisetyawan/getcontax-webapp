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
        ];
    }
}
