<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class BlockWaliMuridWebLogin
{
    /**
     * The request instance.
     *
     * @var \Illuminate\Http\Request
     */
    public $request;

    /**
     * Create the event listener.
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        // Cek jika guard yang digunakan adalah 'web' DAN user memiliki peran 'wali_murid'
        if ($event->guard === 'web' && $event->user->hasRole('wali_murid')) {
            
            // Logout user dari sesi web yang baru saja dibuat
            Auth::guard('web')->logout();

            // Invalidate sesi untuk keamanan
            $this->request->session()->invalidate();
            $this->request->session()->regenerateToken();

            // Kirim kembali ke halaman login dengan pesan error yang jelas
            throw ValidationException::withMessages([
                'email' => 'Akun wali murid hanya dapat digunakan untuk login via aplikasi mobile.',
            ]);
        }
    }
}