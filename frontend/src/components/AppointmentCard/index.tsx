import {
    Calendar,
    Clock,
    User,
    Stethoscope,
    Trash2,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
} from "../Card";

import { Button } from "../Button";
import type { Appointment, UserType } from "../../types/appointments";

interface AppointmentCardProps {
    appointment: Appointment;
    userType: UserType;
    onCancel?: (id: string) => void;
}

export function AppointmentCard({
    appointment,
    userType,
    onCancel,
}: AppointmentCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(
            dateString + "T00:00:00"
        );

        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const statusStyles = {
        scheduled:
            "bg-blue-100 text-blue-700",

        completed:
            "bg-green-100 text-green-700",

        cancelled:
            "bg-red-100 text-red-700",
    };

    const statusText = {
        scheduled: "Agendada",

        completed: "Concluída",

        cancelled: "Cancelada",
    };

    return (
        <Card className="shadow-sm hover:shadow-md transition-all border-border">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />

                            <h3 className="text-xl font-semibold text-primary">
                                {userType === "patient"
                                    ? appointment.medic
                                    : userType === "admin"
                                      ? appointment.patientName
                                      : appointment.patientName}
                            </h3>
                        </div>

                        <div
                            className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[appointment.status]}`}
                        >
                            {
                                statusText[
                                    appointment.status
                                ]
                            }
                        </div>
                    </div>

                    {appointment.status ===
                        "scheduled" &&
                        onCancel && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    onCancel(
                                        appointment.id
                                    )
                                }
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-foreground">
                    <Calendar className="w-4 h-4" />

                    <span>
                        {formatDate(
                            appointment.date
                        )}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-foreground">
                    <Clock className="w-4 h-4" />

                    <span>
                        {appointment.time}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-foreground">
                    <Stethoscope className="w-4 h-4" />

                    <span>
                        {appointment.specialty}
                    </span>
                </div>

                {userType === "admin" && (
                    <div className="flex items-center gap-2 text-sm text-foreground">
                        <User className="w-4 h-4" />

                        <span>
                            Médico:{" "}
                            {appointment.medic}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}