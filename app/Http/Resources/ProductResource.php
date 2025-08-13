<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'name' => (string) $this->name,
            'barcode' => $this->barcode, // string or null
            'price' => (float) $this->price,
            'discount_nominal' => (float) $this->discount_nominal,
            'stock' => (int) $this->stock,
            'is_consignment' => (bool) $this->is_consignment,
            'is_available' => (bool) $this->is_available,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
