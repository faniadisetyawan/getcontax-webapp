<?php

namespace App\Http\Controllers;

use App\Http\Resources\ContactResource;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $sort = $request->query('sort', 'created_at');
        $order = $request->query('order', 'desc');
        $perPage = $request->query('per_page', 15);

        $query = Contact::query();
        if ($request->filled('search')) {
            $query->where('phone_number', 'like', "%{$search}%")
                ->orWhere('name', 'like', "%{$search}%");
        }
        $query->orderBy($sort, $order);
        $contact = ContactResource::collection($query->paginate($perPage));

        return Inertia::render('contact/index', [
            'metaOptions' => [
                'title' => 'Contact',
                'description' => 'List of contacts',
            ],
            'responseData' => $contact,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('contact/form-builder', [
            'metaOptions' => [
                'title' => 'Add new Contact',
            ],
            'old' => null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'phone_number' => ['required', 'string', 'max:15', Rule::unique('contacts')],
            'name' => ['required', 'string', 'max:50'],
            'avatar' => ['nullable', 'image'],
            'status_id' => ['required', 'exists:statuses,id'],
        ]);

        $contact = new Contact();
        $contact->fill($validated);
        $contact->save();

        if ($request->hasFile('avatar')) {
            $uploadedAvatar = $request->file('avatar');
            $filename = $uploadedAvatar->hashName();
            $uploadedAvatar->storeAs("contacts", $filename, 'public');
            $contact->avatar = $filename;
        }

        $contact->save();

        return to_route('contacts.index')->with('success', 'Successfully added');
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
        $resource = Contact::findOrFail($id);
        ContactResource::withoutWrapping();
        $old = new ContactResource($resource);

        return Inertia::render('contact/form-builder', [
            'metaOptions' => [
                'title' => 'Edit Contact',
            ],
            'old' => $old,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $contact = Contact::findOrFail($id);

        $validated = $request->validate([
            'phone_number' => ['required', 'string', 'max:15', Rule::unique('contacts')->ignore($id)],
            'name' => ['required', 'string', 'max:50'],
            'avatar' => ['nullable', 'image'],
            'status_id' => ['required', 'exists:statuses,id'],
        ]);

        if ($request->hasFile('avatar')) {
            if ($contact->avatar && Storage::disk('public')->exists("contacts/{$contact->avatar}")) {
                Storage::disk('public')->delete("contacts/{$contact->avatar}");
            }

            $filename = $request->file('avatar')->hashName();
            $request->file('avatar')->storeAs("contacts", $filename, 'public');
            $validated['avatar'] = $filename;
        } else {
            $validated['avatar'] = $contact->avatar;
        }

        $contact->update($validated);

        return to_route('contacts.index')->with('success', 'Successfully updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $contact = Contact::findOrFail($id);

        if (Storage::disk('public')->exists("contacts/{$contact->avatar}")) {
            Storage::disk('public')->delete("contacts/{$contact->avatar}");
        }

        $contact->delete();

        return redirect()
            ->route('contacts.index', request()->query())
            ->with('success', 'Successfully deleted');
    }
}
