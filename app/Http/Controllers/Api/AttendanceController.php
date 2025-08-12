<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function tap(Request $request)
    {
        $request->validate(['rfid_uid' => 'required|exists:students,rfid_uid']);

        $now = Carbon::now('Asia/Jakarta');
        $student = Student::where('rfid_uid', $request->rfid_uid)->first();
        $school = $student->school;
        if (!$school->checkin_start_time || !$school->checkout_start_time) {
            return response()->json([
                'success' => false,
                'message' => 'Jadwal absensi untuk sekolah ini belum diatur.'
            ], 404);
        }
        $checkinStartTime = Carbon::createFromTimeString($school->checkin_start_time, 'Asia/Jakarta');
        $checkinEndTime = Carbon::createFromTimeString($school->checkin_end_time, 'Asia/Jakarta');
        $checkoutStartTime = Carbon::createFromTimeString($school->checkout_start_time, 'Asia/Jakarta');
        $checkoutEndTime = Carbon::createFromTimeString($school->checkout_end_time, 'Asia/Jakarta');

        if ($now->between($checkinStartTime, $checkinEndTime)) {
            return $this->processCheckIn($student);
        }

        if ($now->between($checkoutStartTime, $checkoutEndTime)) {
            return $this->processCheckOut($student);
        }

        return response()->json([
            'success' => false,
            'message' => 'Absensi hanya bisa dilakukan pada jam yang telah ditentukan.',
        ], 403); // 403 Forbidden
    }

    private function processCheckIn(Student $student)
    {
        $attendance = Attendance::firstOrNew([
            'student_id' => $student->id,
            'date'       => now()->toDateString(),
        ]);

        if ($attendance->time_in) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah absen masuk hari ini.',
            ], 409);
        }

        $attendance->time_in = now()->toTimeString();
        $attendance->save();

        return response()->json([
            'success' => true,
            'message' => 'Check-in berhasil!',
            'data' => ['name' => $student->name, 'time_in' => $attendance->time_in]
        ]);
    }

    private function processCheckOut(Student $student)
    {
        $attendance = Attendance::firstOrNew([
            'student_id' => $student->id,
            'date'       => now()->toDateString(),
        ]);

        if ($attendance->time_out) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah absen pulang hari ini.',
            ], 409);
        }

        $attendance->time_out = now()->toTimeString();
        $attendance->save();

        return response()->json([
            'success' => true,
            'message' => 'Check-out berhasil!',
            'data' => ['name' => $student->name, 'time_out' => $attendance->time_out]
        ]);
    }
}
