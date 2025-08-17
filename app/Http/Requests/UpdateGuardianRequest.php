<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGuardianRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $guardianId = $this->guardian->id ?? $this->route('guardian');
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $guardianId,
            'password' => 'nullable|sometimes|string|min:8|confirmed',
            'student_ids' => 'required|array|min:1',
            'student_ids.*' => 'required|exists:students,id',
        ];
    }
}
