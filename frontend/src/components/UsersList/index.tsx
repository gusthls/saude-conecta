import { useState } from "react";
import { Users, Edit2 } from "lucide-react";

import { Button } from "../Button";

import type { UserType } from "../../types/appointments";

interface UserItem {
    id: string;
    name: string;
    email: string;
    role: UserType;
    active: boolean;
    phone?: string;
    cpf?: string;
}

const initialUsers: UserItem[] = [
    {
        id: "u1",
        name: "Admin Principal",
        email: "admin@exemplo.com",
        role: "admin",
        active: true,
        phone: "(11) 11111-1111",
        cpf: "111.111.111-11",
    },
    {
        id: "u2",
        name: "Dr. João Silva",
        email: "joao@clinica.com",
        role: "medic",
        active: true,
        phone: "(11) 22222-2222",
        cpf: "222.222.222-22",
    },
    {
        id: "u3",
        name: "Maria Paciente",
        email: "maria@cliente.com",
        role: "patient",
        active: false,
        phone: "(11) 33333-3333",
        cpf: "333.333.333-33",
    },
];

export function UsersList() {
    const [users, setUsers] = useState<UserItem[]>(initialUsers);
    const [roleFilter, setRoleFilter] = useState<"all" | UserType>("all");
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [confirmToggleUser, setConfirmToggleUser] = useState<UserItem | null>(null);

    const toggleActive = (id: string) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
        );
        setConfirmToggleUser(null);
    };

    // criação de usuários removida — gerenciamento via backend recomendado

    return (
        <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                    </div>

                    <div>
                        <p className="font-semibold">Usuários</p>
                        <p className="text-sm text-muted-foreground">Lista de usuários com ações de gerenciamento</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-sm text-muted-foreground">Filtrar por tipo:</label>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as any)}
                        className="h-9 rounded-md border border-border px-3 bg-input-background"
                    >
                        <option value="all">Todos</option>
                        <option value="patient">Paciente</option>
                        <option value="medic">Médico</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
            </div>

            {users.filter((u) => roleFilter === "all" || u.role === roleFilter).length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">Nenhum usuário encontrado</div>
            ) : (
                <div className="space-y-3">
                    {users
                        .filter((u) => roleFilter === "all" || u.role === roleFilter)
                        .map((u) => (
                        <div
                            key={u.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                        >
                            <div>
                                <p className="font-medium">{u.name} <span className="text-sm text-muted-foreground">({u.role})</span></p>
                                <p className="text-sm text-muted-foreground">{u.email}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="text-sm text-muted-foreground mr-2">
                                    {u.active ? (
                                        <span className="text-green-600 font-medium">Ativo</span>
                                    ) : (
                                        <span className="text-red-600 font-medium">Inativo</span>
                                    )}
                                </div>

                                <Button size="sm" variant="outline" className="min-w-[100px]" onClick={() => setConfirmToggleUser(u)}>
                                    {u.active ? "Desativar" : "Ativar"}
                                </Button>

                                <Button size="sm" variant="outline" onClick={() => setEditingUser(u)}>
                                    <Edit2 className="w-4 h-4 mr-2" />Editar
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-primary">Editar Usuário</h2>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nome</label>
                                <input
                                    className="w-full h-10 rounded-md border px-3"
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">E-mail</label>
                                <input
                                    className="w-full h-10 rounded-md border px-3"
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Telefone</label>
                                <input
                                    className="w-full h-10 rounded-md border px-3"
                                    value={editingUser.phone || ""}
                                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">CPF</label>
                                <input
                                    className="w-full h-10 rounded-md border px-3"
                                    value={editingUser.cpf || ""}
                                    onChange={(e) => setEditingUser({ ...editingUser, cpf: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Tipo</label>
                                <div className="w-full h-10 rounded-md border px-3 flex items-center bg-input-background text-sm">
                                    {editingUser.role}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                                    Cancelar
                                </Button>

                                <Button
                                    type="button"
                                    onClick={() => {
                                        setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? editingUser : u)));
                                        setEditingUser(null);
                                    }}
                                >
                                    Salvar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Activate/Deactivate Modal */}
            {confirmToggleUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-primary">
                                {confirmToggleUser.active ? "Desativar usuário" : "Ativar usuário"}
                            </h3>
                        </div>

                        <p className="text-sm text-muted-foreground mb-6">Deseja realmente {confirmToggleUser.active ? "desativar" : "ativar"} o usuário <strong>{confirmToggleUser.name}</strong>?</p>

                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setConfirmToggleUser(null)}>Cancelar</Button>
                            <Button onClick={() => toggleActive(confirmToggleUser.id)}>{confirmToggleUser.active ? "Desativar" : "Ativar"}</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UsersList;
