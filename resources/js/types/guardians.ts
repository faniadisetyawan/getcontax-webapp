interface SimpleStudent {
    id: number;
    name: string;
}

export interface Guardian {
    id: number;
    name: string;
    email: string;
    phone_number: string | null;
    children: SimpleStudent[]; // <-- Pastikan ini ada
}