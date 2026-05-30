import { useState } from "react";
import {
    LogOut,
    Stethoscope,
    Plus,
    Users,
} from "lucide-react";

import { Button } from "../Button";
import { AppointmentCard } from "../AppointmentCard";
import { RegisterMedicDialog } from "../RegisterMedicDialog";
import { AdminAppointmentDialog } from "../AdminAppointmentDialog";
import { UsersList } from "../UsersList";

import type { Appointment } from "../../types/appointments";
import type { AdminAppointmentFormData } from "../AdminAppointmentDialog";

interface AdminPanelProps {
    appointments: Appointment[];
    onLogout: () => void;
    onCreateAppointment?: (
        data: AdminAppointmentFormData
    ) => void;
}

export function AdminPanel({
    appointments,
    onLogout,
    onCreateAppointment,
}: AdminPanelProps) {
    const [medicDialogOpen, setMedicDialogOpen] =
        useState(false);

    const [appointmentDialogOpen, setAppointmentDialogOpen] =
        useState(false);

    const [filterByDoctor, setFilterByDoctor] =
        useState<string>("");

    const [filterBySpecialty, setFilterBySpecialty] =
        useState<string>("");
    const [showUsers, setShowUsers] = useState(false);
    const [statusFilter, setStatusFilter] = useState<
        | "all"
        | "scheduled"
        | "completed"
        | "cancelled"
    >("all");

    // Extrair médicos e especialidades únicos
    const uniqueDoctors = Array.from(
        new Set(
            appointments.map(
                (appointment) =>
                    appointment.medic
            )
        )
    );

    const uniqueSpecialties = Array.from(
        new Set(
            appointments.map(
                (appointment) =>
                    appointment.specialty
            )
        )
    );

    // Filtrar consultas (por médico, especialidade e status)
    const filteredAppointments = appointments.filter(
        (appointment) => {
            const matchesDoctor =
                !filterByDoctor || appointment.medic === filterByDoctor;
            const matchesSpecialty =
                !filterBySpecialty || appointment.specialty === filterBySpecialty;
            const matchesStatus =
                statusFilter === "all" || appointment.status === statusFilter;

            return matchesDoctor && matchesSpecialty && matchesStatus;
        }
    );

    // Contar por status
    const scheduledCount = filteredAppointments.filter(
        (a) => a.status === "scheduled"
    ).length;
    const completedCount =
        filteredAppointments.filter(
            (a) => a.status === "completed"
        ).length;
    const cancelledCount =
        filteredAppointments.filter(
            (a) => a.status === "cancelled"
        ).length;

    const handleRegisterMedic = (data: {
        name: string;
        specialty: string;
        email: string;
        phone: string;
        crm: string;
    }) => {
        console.log("Novo médico registrado:", data);
        setMedicDialogOpen(false);
    };

    const handleAdminCreateAppointment = (
        data: AdminAppointmentFormData
    ) => {
        if (onCreateAppointment) {
            onCreateAppointment(data);
        }
        setAppointmentDialogOpen(false);
    };

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
                                Painel Administrativo
                            </h1>

                            <p className="text-muted-foreground">
                                Gerencie consultas e
                                médicos
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
                {/* HEADER SECTION */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-semibold text-primary">
                            Consultas
                        </h2>

                        <p className="text-muted-foreground mt-1">
                            Total: {filteredAppointments.length}{" "}
                            consultas
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={() =>
                                setAppointmentDialogOpen(true)
                            }
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Agendar Consulta
                        </Button>

                        <Button
                            onClick={() =>
                                setMedicDialogOpen(true)
                            }
                        >
                            <Users className="w-4 h-4 mr-2" />
                            Cadastrar Médico
                        </Button>

                        <Button
                            variant={showUsers ? "default" : "outline"}
                            onClick={() => setShowUsers((s) => !s)}
                        >
                            <Users className="w-4 h-4 mr-2" />
                            Gerenciar Usuários
                        </Button>
                    </div>
                </div>

                {/* STATS */}
                <div className="mb-4 flex items-center justify-start gap-3">
                    <button
                        onClick={() => setStatusFilter("scheduled")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                            statusFilter === "scheduled"
                                ? "bg-blue-600 text-white"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }`}
                    >
                        Agendadas ({appointments.filter((a) => a.status === "scheduled").length})
                    </button>

                    <button
                        onClick={() => setStatusFilter("completed")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                            statusFilter === "completed"
                                ? "bg-green-600 text-white"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                    >
                        Concluídas ({appointments.filter((a) => a.status === "completed").length})
                    </button>

                    <button
                        onClick={() => setStatusFilter("cancelled")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                            statusFilter === "cancelled"
                                ? "bg-red-600 text-white"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                    >
                        Canceladas ({appointments.filter((a) => a.status === "cancelled").length})
                    </button>

                    <button
                        onClick={() => setStatusFilter("all")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                            statusFilter === "all"
                                ? "bg-primary text-white"
                                : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                    >
                        Todas ({appointments.length})
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg p-4 border">
                        <p className="text-sm text-muted-foreground">
                            Agendadas
                        </p>
                        <p className="text-2xl font-semibold text-blue-600">
                            {scheduledCount}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 border">
                        <p className="text-sm text-muted-foreground">
                            Concluídas
                        </p>
                        <p className="text-2xl font-semibold text-green-600">
                            {completedCount}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 border">
                        <p className="text-sm text-muted-foreground">
                            Canceladas
                        </p>
                        <p className="text-2xl font-semibold text-red-600">
                            {cancelledCount}
                        </p>
                    </div>
                </div>

                {/* FILTROS */}
                <div className="bg-white rounded-lg p-4 mb-8 border">
                    <h3 className="font-semibold text-lg mb-4">
                        Filtros
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Filtrar por Médico
                            </label>

                            <select
                                value={filterByDoctor}
                                onChange={(e) =>
                                    setFilterByDoctor(
                                        e.target
                                            .value
                                    )
                                }
                                className="w-full h-10 rounded-md border border-border px-3 bg-input-background"
                            >
                                <option value="">
                                    Todos os médicos
                                </option>
                                {uniqueDoctors.map(
                                    (medic) => (
                                        <option
                                            key={medic}
                                            value={medic}
                                        >
                                            {medic}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Filtrar por
                                Especialidade
                            </label>

                            <select
                                value={
                                    filterBySpecialty
                                }
                                onChange={(e) =>
                                    setFilterBySpecialty(
                                        e.target
                                            .value
                                    )
                                }
                                className="w-full h-10 rounded-md border border-border px-3 bg-input-background"
                            >
                                <option value="">
                                    Todas as
                                    especialidades
                                </option>
                                {uniqueSpecialties.map(
                                    (specialty) => (
                                        <option
                                            key={
                                                specialty
                                            }
                                            value={
                                                specialty
                                            }
                                        >
                                            {specialty}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </div>

                    {(filterByDoctor ||
                        filterBySpecialty) && (
                        <Button
                            variant="outline"
                            className="mt-4 h-8 px-3"
                            onClick={() => {
                                setFilterByDoctor(
                                    ""
                                );
                                setFilterBySpecialty(
                                    ""
                                );
                            }}
                        >
                            Limpar Filtros
                        </Button>
                    )}
                </div>

                {/* CONSULTAS or USERS */}
                <div>
                    {showUsers ? (
                        <div>
                            <h3 className="font-semibold text-lg mb-4">
                                Usuários da Plataforma
                            </h3>

                            <UsersList />
                        </div>
                    ) : (
                        <div>
                            <h3 className="font-semibold text-lg mb-4">
                                Todas as Consultas
                            </h3>

                            {filteredAppointments.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-lg border">
                                    <p className="text-muted-foreground">
                                        Nenhuma consulta encontrada
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredAppointments.map((appointment) => (
                                        <AppointmentCard
                                            key={appointment.id}
                                            appointment={appointment}
                                            userType="admin"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* DIALOG */}
            <AdminAppointmentDialog
                open={appointmentDialogOpen}
                onOpenChange={
                    setAppointmentDialogOpen
                }
                onSubmit={
                    handleAdminCreateAppointment
                }
            />

            <RegisterMedicDialog
                open={medicDialogOpen}
                onOpenChange={
                    setMedicDialogOpen
                }
                onSubmit={handleRegisterMedic}
            />
        </div>
    );
}
