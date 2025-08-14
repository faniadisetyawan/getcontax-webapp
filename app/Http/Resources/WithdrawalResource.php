<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WithdrawalResource extends JsonResource
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
            'user' => $this->user,
            'school_id' => (int)$this->school_id,
            'user_id' => (int)$this->user_id,
            'amount' => (float)$this->amount,
            'withdrawal_date' => $this->withdrawal_date->toISOString(),
            'notes' => (string)$this->notes,
        ];
    }
}
