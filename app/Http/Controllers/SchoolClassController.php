<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSchoolClassRequest;
use App\Http\Requests\UpdateSchoolClassRequest;
use App\Http\Resources\SchoolClassResource;
use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SchoolClassController extends Controller
{
    public function index(Request $request)
    {

        $search = $request->query('search');
        $sort = $request->query('sort', 'created_at');
        $order = $request->query('order', 'asc');
        $perPage = $request->query('per_page', 10);

        $query = SchoolClass::query();
        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('barcode', 'like', "%{$search}%");
        }
        $query->orderBy($sort, $order);
        $resource = $query->paginate($perPage);
        $classes = SchoolClassResource::collection($resource);

        return Inertia::render('classes/index', [
            'metaOptions' => ['title' => 'Inventory'],
            'responseData' => $classes,
        ]);
    }

    public function create()
    {
        $teachers = User::where('school_id', Auth::user()->school_id)
            ->whereHas('roles', fn($q) => $q->where('name', 'teacher')) // Asumsi guru punya role 'teacher'
            ->get(['id', 'name']);
        return Inertia::render('classes/form-builder', [
            'metaOptions' => ['title' => 'Tambah Kelas Baru'],
            'teachers' => $teachers,
            'old' => null,
        ]);
    }

    public function store(StoreSchoolClassRequest $request)
    {
        $data = $request->validated();
        $data['school_id'] = Auth::user()->school_id;

        SchoolClass::create($data);
        return to_route('master.classes.index')->with('success', 'Kelas berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $resource = SchoolClass::findOrFail($id);
        if ($resource->school_id !== Auth::user()->school_id) {
            abort(403);
        }
        $teachers = User::where('school_id', Auth::user()->school_id)
            ->whereHas('roles', fn($q) => $q->where('name', 'teacher'))
            ->get(['id', 'name']);
        SchoolClassResource::withoutWrapping();
        $classes = new SchoolClassResource($resource);
        return Inertia::render('classes/form-builder', [
            'metaOptions' => ['title' => 'Edit Kelas: ' . $classes->name],
            'teachers' => $teachers,
            'old' => $classes,
        ]);
    }

    public function update(UpdateSchoolClassRequest $request, string $id)
    {
        $classes = SchoolClass::findOrFail($id);
        $classes->update($request->validated());
        return to_route('master.classes.index')->with('success', 'Kelas berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $classes = SchoolClass::findOrFail($id);
        if ($classes->school_id !== Auth::user()->school_id) {
            abort(403);
        }
        if ($classes->orderDetails()->exists()) {
            return back()->with('error', 'Kelas tidak bisa dihapus karena memiliki riwayat transaksi.');
        }

        $classes->delete();
        return redirect()
            ->route('master.classes.index', request()->query())
            ->with('success', 'Kelas berhasil dihapus.');
    }
}
