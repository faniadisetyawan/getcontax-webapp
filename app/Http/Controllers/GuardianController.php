<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGuardianRequest;
use App\Http\Requests\UpdateGuardianRequest;
use App\Http\Resources\GuardianResource;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class GuardianController extends Controller
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

        $query = User::query()
            ->whereHas('roles', fn($q) => $q->where('name', 'wali_murid'))
            ->with('children:id,name,reg_id');

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        }
        $query->orderBy($sort, $order);
        $resource = $query->paginate($perPage);
        $guardians = UserResource::collection($resource);
        return Inertia::render('guardians/index', [
            'metaOptions' => [
                'title' => 'Daftar Wali Murid',
                'description' => 'Manajemen data wali murid',
            ],
            'responseData' => $guardians,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $students = Student::where('school_id', Auth::user()->school_id)
            ->whereDoesntHave('guardians')
            ->get(['id', 'name', 'reg_id']);

        return Inertia::render('guardians/form-builder', [
            'metaOptions' => ['title' => 'Tambah Wali Murid'],
            'students' => $students,
            'old' => null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGuardianRequest $request)
    {
        $guardian = User::create([
            'school_id' => Auth::user()->school_id,
            'name' => $request->name,
            'email' => $request->email,
            'address' => $request->address,
            'phone_number' => $request->phone_number,
            'password' => Hash::make($request->password),
        ]);

        $waliMuridRole = Role::where('name', 'wali_murid')->first();
        if ($waliMuridRole) {
            $guardian->roles()->attach($waliMuridRole);
        }
        $studentsToSync = [];
        foreach ($request->relations as $relation) {
            $studentsToSync[$relation['student_id']] = ['relationship_type' => $relation['relationship_type']];
        }

        $guardian->children()->sync($studentsToSync);
        return to_route('master.guardians.index')->with('success', 'Wali Murid berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $resource = User::findOrFail($id);
        $resource->load('children:id,name,reg_id');

        $childrenIds = $resource->children->pluck('id');

        UserResource::withoutWrapping();
        $old = new UserResource($resource);

        $students = Student::where('school_id', Auth::user()->school_id)
            ->where(function ($query) use ($childrenIds) {
                $query->whereDoesntHave('guardians')
                    ->orWhereIn('id', $childrenIds);
            })
            ->get(['id', 'name', 'reg_id']);

        return Inertia::render('guardians/form-builder', [
            'metaOptions' => [
                'title' => 'Edit Data',
            ],
            'students' => $students,
            'old' => $old,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGuardianRequest $request, String $id)
    {
        $guardian = User::findOrFail($id);
        $guardian->update([
            'name' => $request->name,
            'email' => $request->email,
            'address' => $request->address,
            'phone_number' => $request->phone_number,
        ]);

        if ($request->filled('password')) {
            $guardian->password = Hash::make($request->password);
            $guardian->save();
        }

        $studentsToSync = [];
        foreach ($request->relations as $relation) {
            $studentsToSync[$relation['student_id']] = ['relationship_type' => $relation['relationship_type']];
        }

        $guardian->children()->sync($studentsToSync);

        return to_route('master.guardians.index')->with('success', 'Wali Murid berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(String $id)
    {
        $guardian = User::findOrFail($id);
        $guardian->children()->detach();
        $guardian->delete();

        return to_route('master.guardians.index')->with('success', 'Wali Murid berhasil dihapus.');
    }
}
