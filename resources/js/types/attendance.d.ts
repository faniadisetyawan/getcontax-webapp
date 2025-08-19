import { Student } from "./students";

export interface Attendance {
    id: number;
    student_id: number;
    date: string;
    time_in: string;
    time_out: string;
    status: string | null;
    remarks: string | null;
    student?: Student;
}