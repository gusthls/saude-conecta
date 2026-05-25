
export interface Appointment {
    id: string;
    patientName: string;
    doctor: string;
    specialty: string;
    date: string;
    time: string;
    status: AppointmentStatus;
}

export interface AppointmentFormData {
    patientName: string;
    date: string;
    time: string;
    specialty: string;
    doctor: string;
}

export type AppointmentStatus =
    | "scheduled"
    | "completed"
    | "cancelled";

export type UserType =
    | "patient"
    | "doctor"
    | "admin";