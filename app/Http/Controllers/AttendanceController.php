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
        $query->with(['student']);
        $query->orderBy($sort, $order);
        $resource = $query->paginate($perPage);
        $data = AttendanceResource::collection($resource);

        return Inertia::render('attendance/index', [
            'metaOptions' => [
                'title' => 'Riwayat Absensi',
            ],
            'responseData' => $data,
        ]);
    }

    public function destroy($id)
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->delete();

        return back()->with('success', 'Deleted successfully');
    }
}
