import { useState } from "react";

import { Button } from "../Button";
import { Input } from "../Input";
import { Label } from "../Label";

interface AppointmentModalProps {
    open: boolean;
    onClose: () => void;
    onCreate: (appointment: any) => void;
}

export function AppointmentModal({
    open,
    onClose,
    onCreate,
}: AppointmentModalProps) {
    const [formData, setFormData] = useState({
        patientName: "",
        date: "",
        time: "",
        specialty: "",
        medic: "",
    });

    if (!open) return null;

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        onCreate(formData);

        setFormData({
            patientName: "",
            date: "",
            time: "",
            specialty: "",
            medic: ""
        });

        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-card rounded-xl p-6 w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-6">
                    Nova Consulta
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div>
                        <Label>Paciente</Label>

                        <Input
                            name="patientName"
                            value={formData.patientName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Data</Label>

                            <Input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <Label>Hora</Label>

                            <Input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Especialidade</Label>

                        <Input
                            name="specialty"
                            value={formData.specialty}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label>Médico</Label>

                        <Input
                            name="medic"
                            value={formData.medic}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label>Observações</Label>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancelar
                        </Button>

                        <Button type="submit">
                            Criar Consulta
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}