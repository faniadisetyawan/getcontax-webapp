<?php

namespace App\Http\Controllers;

use App\Http\Resources\AttendanceResource;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $sort = $request->query('sort', 'updated_at');
        $order = $request->query('order', 'desc');
        $perPage = $request->query('per_page', 15);

        $query = Attendance::query();
        $query->orderBy($sort, $order);
        $resource = $query->paginate($perPage);
        $attendances = AttendanceResource::collection($resource);

        return Inertia::render('attendance/listing', [
            'metaOptions' => [
                'title' => 'Riwayat Absensi',
            ],
            'attendances' => $attendances,
        ]);
    }
}
