// Tipe data untuk User dalam konteks sebagai Wali Murid (Guardian)
export interface Guardian {
    id: number;
    name: string;
    email: string;
    phone_number: string | null;
}

// Tipe data utama untuk objek Student
export interface Student {
    id: number;
    school_id: number;
    nisn: string;
    name: string;
    rfid_uid: string | null;
    va_number: string | null;
    balance: number;
    gender: 'Laki-laki' | 'Perempuan' | null;
    birth_place: string | null;
    birth_date: string | null; // Format YYYY-MM-DD
    entry_year: string | null;
    status: 'aktif' | 'lulus' | 'pindah' | 'dikeluarkan';
    created_at: string;
    updated_at: string;

    // Relasi (opsional, tergantung data yang Anda kirim dari controller)
    guardians?: Guardian[]; 
}