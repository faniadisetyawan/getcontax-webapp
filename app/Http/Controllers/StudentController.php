<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Http\Resources\StudentResource;
use App\Imports\StudentsImport;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $search = $request->query('search');
        $sort = $request->query('sort', 'created_at');
        $order = $request->query('order', 'asc');
        $perPage = $request->query('per_page', 10);

        $query = Student::query();
        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('reg_id', 'like', "%{$search}%");
        }
        $query->orderBy($sort, $order);
        $resource = $query->paginate($perPage);
        $students = StudentResource::collection($resource);

        return Inertia::render('students/index', [
            'metaOptions' => [
                'title' => 'Daftar Siswa',
                'description' => 'Manajemen data siswa',
            ],
            'responseData' => $students,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('students/form-builder', [
            'metaOptions' => ['title' => 'Tambah Data Siswa'],
            'old' => null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentRequest $request)
    {
        $validated = $request->validated();
        $schoolId = Auth::user()->school_id;
        $dataToSave = array_merge($validated, ['school_id' => $schoolId]);
        Student::create($dataToSave);

        return to_route('master.students.index')->with('success', 'Berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $resource = Student::findOrFail($id);
        StudentResource::withoutWrapping();
        $old = new StudentResource($resource);

        return Inertia::render('students/form-builder', [
            'metaOptions' => [
                'title' => 'Edit Data',
            ],
            'old' => $old,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentRequest $request, string $id)
    {
        $student = Student::findOrFail($id);
        $student->update($request->validated());

        return to_route('master.students.index')->with('success', 'Successfully updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $student = Student::findOrFail($id);

        $student->delete();

        return to_route('master.students.index')->with('success', 'Successfully deleted');
    }

    public function showImportForm()
    {
        return Inertia::render('students/import', [
            'metaOptions' => ['title' => 'Impor Data Siswa'],
        ]);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv',
        ]);

        try {
            $schoolId = Auth::user()->school_id;
            Excel::import(new StudentsImport($schoolId), $request->file('file'));
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat mengimpor data. Pastikan format file Anda benar. Error: ' . $e->getMessage());
        }

        return to_route('master.students.index')->with('success', 'Data siswa berhasil diimpor.');
    }

    public function downloadTemplate()
    {
        // Tentukan path ke file template di dalam folder storage
        $path = storage_path('app/templates/template_import_siswa.xlsx');

        // Cek apakah file benar-benar ada untuk menghindari error
        if (!File::exists($path)) {
            abort(404, 'File template tidak ditemukan.');
        }

        // Gunakan helper 'download' dari Laravel
        // Laravel akan secara otomatis mengatur header yang benar agar browser men-download file
        return response()->download($path);
    }

    public function registerCard(Request $request, Student $student)
    {
        $validated = $request->validate([
            'rfid_uid' => ['nullable', 'string', 'max:255', \Illuminate\Validation\Rule::unique('students')->ignore($student->id)],
            'va_number' => ['nullable', 'string', 'max:255', \Illuminate\Validation\Rule::unique('students')->ignore($student->id)],
        ]);

        $student->update($validated);

        return back()->with('success', 'Data untuk ' . $student->name . ' berhasil diperbarui.');
    }
}
