<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use Illuminate\Http\Request;

class GuardianController extends Controller
{
    public function getMyChildren(Request $request)
    {
        $user = $request->user(); // Diambil dari token Sanctu
        $children = $user->children()
            ->with(['attendances' => function ($query) {
                $query->latest()->limit(5);
            }, 'financialHistories' => function ($query) {
                $query->latest()->limit(5);
            }])
            ->get()
            ->map(function ($child) {
                // Pastikan selalu array, meski kosong
                $child->attendances = $child->attendances ?? [];
                $child->financialHistories = $child->financialHistories ?? [];
                return $child;
            });

        // Respons berupa data JSON, dibungkus dengan API Resource
        return $children;
    }
}
