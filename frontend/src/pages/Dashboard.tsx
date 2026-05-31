import { useState, useEffect } from "react";

import {
    CheckCircle,
    Plus,
    LogOut,
    Stethoscope,
} from "lucide-react";

import { Button } from "../components/Button";

import { AppointmentCard } from "../components/AppointmentCard";

import { AppointmentDialog } from "../components/AppointmentDialog";

import { AdminPanel } from "../components/AdminPanel";

import type {
    Appointment,
    UserType,
} from "../types/appointments";

import type { AppointmentFormData } from "../components/AppointmentDialog";
import type { AdminAppointmentFormData } from "../components/AdminAppointmentDialog";

interface DashboardProps {
    onLogout: () => void;
    userType: UserType;
}

export function Dashboard({
    onLogout,
    userType,
}: DashboardProps) {

    const [dialogOpen, setDialogOpen] =
        useState(false);

    const [activeFilter, setActiveFilter] =
        useState<
            | "all"
            | "scheduled"
            | "completed"
            | "cancelled"
        >("all");

    const [appointments, setAppointments] =
        useState<Appointment[]>([]);

    // loading state currently unused; keep if needed later

    const handleCreateAppointment = (
        data: AppointmentFormData
    ) => {
        const newAppointment: Appointment = {
            id: Date.now().toString(),
            patientName: "Paciente Atual",
            ...data,
            status: "scheduled",
        };

        setAppointments([
            newAppointment,
            ...appointments,
        ]);
    };

    // Carregar consultas da API conforme userType
    useEffect(() => {
        const load = async () => {
            // start loading

            try {
                const raw = localStorage.getItem('session');
                let medicId: string | undefined;
                let patientId: string | undefined;
                if (raw) {
                    const s = JSON.parse(raw);
                    if (s.userType === 'medic') medicId = s.user?.id;
                    if (s.userType === 'patient') patientId = s.user?.id;
                }

                const params = new URLSearchParams();
                if (medicId) params.set('medicId', String(medicId));
                if (patientId) params.set('patientId', String(patientId));

                const scheduledRes = await fetch(
                    `http://localhost:3000/api/appointments${params.toString() ? `?${params.toString()}` : ''}`
                );
                const scheduled = scheduledRes.ok ? await scheduledRes.json() : [];

                const completedRes = await fetch(
                    `http://localhost:3000/api/appointments/completed${params.toString() ? `?${params.toString()}` : ''}`
                );
                const completed = completedRes.ok ? await completedRes.json() : [];

                // Combine and set
                setAppointments([
                    ...scheduled.map((a: any) => ({
                        id: String(a.id),
                        patientName: a.patientName || '',
                        medic: a.medic || '',
                        specialty: a.specialty || '',
                        date: a.date || '',
                        time: a.time || '',
                        status: 'scheduled' as const,
                    })),
                    ...completed.map((a: any) => ({
                        id: String(a.id),
                        patientName: a.patientName || '',
                        medic: a.medic || '',
                        specialty: a.specialty || '',
                        date: a.date || '',
                        time: a.time || '',
                        status: 'completed' as const,
                    })),
                ]);
            } catch (e) {
                console.error('Erro ao carregar consultas:', e);
            } finally {
                // finished loading
            }
        };

        load();
    }, []);

    const handleAdminCreateAppointment = (
        data: AdminAppointmentFormData
    ) => {
        const newAppointment: Appointment = {
            id: Date.now().toString(),
            ...data,
            status: "scheduled",
        };

        setAppointments([
            newAppointment,
            ...appointments,
        ]);
    };

    const handleCancelAppointment = (
        id: string
    ) => {
        setAppointments(
            appointments.map((appointment) =>
                appointment.id === id
                    ? {
                          ...appointment,
                          status:
                              "cancelled" as const,
                      }
                    : appointment
            )
        );
    };

    const handleCompleteAppointment = (
        id: string
    ) => {
        setAppointments(
            appointments.map((appointment) =>
                appointment.id === id
                    ? {
                          ...appointment,
                          status:
                              "completed" as const,
                      }
                    : appointment
            )
        );
    };

    const scheduledAppointments =
        appointments.filter(
            (appointment) =>
                appointment.status ===
                "scheduled"
        );

    const completedAppointments =
        appointments.filter(
            (appointment) =>
                appointment.status ===
                "completed"
        );

    const cancelledAppointments =
        appointments.filter(
            (appointment) =>
                appointment.status ===
                "cancelled"
        );

    // Filtrar por status quando selecionado
    const filteredAppointments =
        activeFilter === "all"
            ? appointments
            : appointments.filter(
                  (appointment) =>
                      appointment.status === activeFilter
              );

    // Renderizar a interface do Admin
    if (userType === "admin") {
        return (
            <AdminPanel
                appointments={appointments}
                onLogout={onLogout}
                onCreateAppointment={
                    handleAdminCreateAppointment
                }
            />
        );
    }

    return (
        <div className="min-h-screen bg-muted/30">
            {/* HEADER */}
            <header className="border-b bg-white">
                <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Stethoscope className="w-6 h-6 text-primary" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-semibold text-primary">
                                Sistema de Consultas
                            </h1>

                            <p className="text-muted-foreground">
                                {userType ===
                                "patient"
                                    ? "Gerencie suas consultas médicas"
                                    : "Gerencie consultas dos pacientes"}
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        onClick={onLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair
                    </Button>
                </div>
            </header>

            {/* MAIN */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-semibold text-primary">
                            Minhas Consultas
                        </h2>

                        <p className="text-muted-foreground mt-1">
                            Total:{" "}
                            {appointments.length}{" "}
                            consultas
                        </p>
                    </div>

                    {userType === "patient" && (
                        <Button
                            onClick={() =>
                                setDialogOpen(true)
                            }
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Consulta
                        </Button>
                    )}
                </div>

                {/* FILTROS */}
                <div className="flex gap-4 mb-8 flex-wrap">
                    <button
                        onClick={() =>
                            setActiveFilter(
                                "scheduled"
                            )
                        }
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                            activeFilter ===
                            "scheduled"
                                ? "bg-blue-600 text-white"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }`}
                    >
                        Agendadas (
                        {
                            scheduledAppointments.length
                        }
                        )
                    </button>

                    <button
                        onClick={() =>
                            setActiveFilter(
                                "completed"
                            )
                        }
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                            activeFilter ===
                            "completed"
                                ? "bg-green-600 text-white"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                    >
                        Concluídas (
                        {
                            completedAppointments.length
                        }
                        )
                    </button>

                    <button
                        onClick={() =>
                            setActiveFilter(
                                "cancelled"
                            )
                        }
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                            activeFilter ===
                            "cancelled"
                                ? "bg-red-600 text-white"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                    >
                        Canceladas (
                        {
                            cancelledAppointments.length
                        }
                        )
                    </button>

                    <button
                        onClick={() =>
                            setActiveFilter("all")
                        }
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                            activeFilter ===
                            "all"
                                ? "bg-primary text-white"
                                : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                    >
                        Todas (
                        {appointments.length})
                    </button>
                </div>

                {/* GRID */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAppointments.map(
                        (appointment) => (
                            <div
                                key={
                                    appointment.id
                                }
                                className="space-y-3"
                            >
                                <AppointmentCard
                                    appointment={
                                        appointment
                                    }
                                    userType={
                                        userType
                                    }
                                    onCancel={
                                        handleCancelAppointment
                                    }
                                />

                                {userType ===
                                    "medic" &&
                                    appointment.status ===
                                        "scheduled" && (
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() =>
                                                handleCompleteAppointment(
                                                    appointment.id
                                                )
                                            }
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />

                                            Marcar como
                                            concluída
                                        </Button>
                                    )}
                            </div>
                        )
                    )}
                </div>
            </main>

            {/* DIALOG */}
            {userType === "patient" && (
                <AppointmentDialog
                    open={dialogOpen}
                    onOpenChange={
                        setDialogOpen
                    }
                    onSubmit={
                        handleCreateAppointment
                    }
                />
            )}
        </div>
    );
}