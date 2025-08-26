import { Status } from "./status";

export interface Contact {
    id: number;
    phone_number: string;
    name: string;
    avatar: string;
    avatar_url: string;
    status_id: number;
    status: Status;
    created_at: string;
    updated_at: string;
}