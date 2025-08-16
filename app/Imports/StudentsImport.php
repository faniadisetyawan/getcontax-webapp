<?php

namespace App\Imports;

use App\Models\Student;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class StudentsImport implements ToCollection, WithHeadingRow
{
    private $schoolId;

    public function __construct(int $schoolId)
    {
        $this->schoolId = $schoolId;
    }

    /**
    * @param Collection $rows
    */
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) 
        {
            // Update data jika NISN sudah ada, atau buat baru jika belum ada.
            // Ini mencegah data siswa duplikat.
            Student::updateOrCreate(
                [
                    'reg_id' => $row['reg_id'],
                    'school_id' => $this->schoolId,
                ],
                [
                    'nisn' => $row['nisn'],
                    'nis_nipd' => $row['nis_nipd'],
                    'name' => $row['nama'],
                    'gender' => $row['jenis_kelamin'],
                    'birth_place' => $row['tempat_lahir'],
                    'birth_date' => \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($row['tanggal_lahir']),
                    'entry_year' => $row['tahun_masuk'],
                ]
            );
        }
    }
}