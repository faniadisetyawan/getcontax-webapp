<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FinancialHistoryResource;
use App\Models\Student;

class FinancialHistoryController extends Controller
{
    public function latest(Student $student)
    {
        $resource = $student->financialHistories()->latest()->limit(2)->get();

        FinancialHistoryResource::withoutWrapping();
        return FinancialHistoryResource::collection($resource);
    }
}
