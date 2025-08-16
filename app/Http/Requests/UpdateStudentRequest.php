<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
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
        return [
            'name'          => 'required|string|max:255',
            'reg_id'        => 'nullable|string|max:20|unique:students,reg_id',
            'nisn'          => 'nullable|string|max:20|unique:students,nisn',
            'nis_nipd'      => 'nullable|string|max:20|unique:students,nis_nipd',
            'gender'        => 'nullable|string|in:Laki-laki,Perempuan',
            'birth_place'   => 'nullable|string|max:255',
            'birth_date'    => 'nullable|date',
            'entry_year'    => 'nullable|digits:4|integer|min:2000',
            'status'        => 'nullable|string|in:aktif,lulus,pindah,dikeluarkan',
        ];
    }
}
