<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     * * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles  // Tiga titik ini penting!
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Jika belum login, arahkan ke halaman login
        if (!Auth::check()) {
            return redirect('login');
        }

        // Periksa setiap peran yang diizinkan
        foreach ($roles as $role) {
            // Panggil fungsi hasRole() yang ada di model User
            if ($request->user()->hasRole($role)) {
                // Jika user punya salah satu peran, izinkan lewat
                return $next($request);
            }
        }

        // Jika user tidak punya peran yang diizinkan, tolak akses
        abort(403, 'AKSES DITOLAK. ANDA TIDAK MEMILIKI HAK AKSES.');
    }
}