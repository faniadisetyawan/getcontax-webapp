<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'address' => $this->address,
            'avatar' => $this->avatar,
            'avatar_url' => $this->avatarUrl,
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
            'school' => new SchoolResource($this->school),
            'roles' => $this->whenLoaded('roles', fn() => $this->roles->pluck('name')),
            'childrens' => StudentResource::collection($this->whenLoaded('children')),
        ];
    }
}
