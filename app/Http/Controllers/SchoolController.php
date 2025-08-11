<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSchoolRequest;
use App\Http\Requests\UpdateSchoolRequest;
use App\Http\Resources\SchoolResource;
use App\Models\School;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SchoolController extends Controller
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

        $query = School::query();
        if ($request->filled('search')) {
            $query->where('npsn', 'like', "%{$search}%")
                ->orWhere('name', 'like', "%{$search}%");
        }
        $query->orderBy($sort, $order);
        $resource = $query->paginate($perPage);
        $schools = SchoolResource::collection($resource);

        return Inertia::render('school/index', [
            'metaOptions' => [
                'title' => 'Daftar Sekolah',
                'description' => 'Manajemen data sekolah',
            ],
            'responseData' => $schools,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('school/form-builder', [
            'metaOptions' => [
                'title' => 'Tambah Data Sekolah',
            ],
            'old' => null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSchoolRequest $request)
    {
        $validated = $request->validated();
        $school = new School();
        $school->fill($validated);
        $school->save();

        if ($request->hasFile('logo')) {
            $uploadedLogo = $request->file('logo');
            $filename = $uploadedLogo->hashName();
            $uploadedLogo->storeAs("schools/{$school->id}", $filename, 'public');
            $school->logo = $filename;
        }

        $school->save();

        return to_route('master.schools.index')->with('success', 'Successfully added');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $resource = School::findOrFail($id);
        SchoolResource::withoutWrapping();
        $old = new SchoolResource($resource);

        return Inertia::render('school/form-builder', [
            'metaOptions' => [
                'title' => 'Edit Data',
            ],
            'old' => $old,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSchoolRequest $request, string $id)
    {
        $school = School::findOrFail($id);
        $validated = $request->validated();

        if ($request->hasFile('logo')) {
            if ($school->logo && Storage::disk('public')->exists("schools/{$school->id}/{$school->logo}")) {
                Storage::disk('public')->delete("schools/{$school->id}/{$school->logo}");
            }

            $filename = $request->file('logo')->hashName();
            $request->file('logo')->storeAs("schools/{$school->id}", $filename, 'public');
            $validated['logo'] = $filename;
        } else {
            $validated['logo'] = $school->logo;
        }

        $school->update($validated);

        return to_route('master.schools.index')->with('success', 'Successfully updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $school = School::findOrFail($id);

        if (Storage::disk('public')->exists("schools/{$school->id}")) {
            Storage::disk('public')->deleteDirectory("schools/{$school->id}");
        }

        $school->delete();

        return redirect()
            ->route('master.schools.index', request()->query())
            ->with('success', 'Successfully deleted');
    }
}
