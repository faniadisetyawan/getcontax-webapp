<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContactResource;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Contact::query();
        $query->orderBy('created_at', 'desc');
        $resource = $query->get();

        ContactResource::withoutWrapping();
        return ContactResource::collection($resource);
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

        return response()->json(['message' => 'Successfully added']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $resource = Contact::findOrFail($id);

        ContactResource::withoutWrapping();
        return new ContactResource($resource);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
