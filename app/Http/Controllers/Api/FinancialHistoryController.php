<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FinancialHistoryResource;
use App\Models\FinancialHistory;
use App\Models\Student;
use Illuminate\Http\Request;

class FinancialHistoryController extends Controller
{
    public function index(Request $request)
    {
        $studentId = $request->query('student_id');
        $type = $request->query('type');
        $sort = $request->query('sort', 'created_at');
        $order = $request->query('order', 'desc');
        $perPage = $request->query('per_page', 10);

        $query = FinancialHistory::query();
        $query->where('student_id', $studentId);
        if ($request->filled('type')) {
            $query->where('type', $type);
        }
        $query->orderBy($sort, $order);
        $resource = $query->paginate($perPage);

        return FinancialHistoryResource::collection($resource);
    }

    public function latest(Student $student)
    {
        $resource = $student->financialHistories()->latest()->limit(2)->get();

        FinancialHistoryResource::withoutWrapping();
        return FinancialHistoryResource::collection($resource);
    }
}
