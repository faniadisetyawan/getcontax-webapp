<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSchoolClassRequest extends FormRequest
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
        $classId = $this->route('class')->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('school_classes')->where('school_id', $this->user()->school_id)->ignore($classId),
            ],
            'level' => 'nullable|string|max:50',
            'homeroom_teacher_id' => 'nullable|exists:users,id',
        ];
    }
}
