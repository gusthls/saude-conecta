
export interface Appointment {
    id: string;
    patientName: string;
    medic: string;
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
    medic: string;
}

export type AppointmentStatus =
    | "scheduled"
    | "completed"
    | "cancelled";

export type UserType =
    | "patient"
    | "medic"
    | "admin";