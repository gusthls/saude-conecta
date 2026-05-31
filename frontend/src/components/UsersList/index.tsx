import { useState, useEffect } from "react";
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
    backendId?: string;
}

export function UsersList() {
    const [users, setUsers] = useState<UserItem[]>([]);
    const [roleFilter, setRoleFilter] = useState<"all" | UserType>("all");
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [confirmToggleUser, setConfirmToggleUser] = useState<UserItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [savingEdit, setSavingEdit] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true);
            setError(null);

            try {
                const [patientsRes, medicsRes, adminsRes] = await Promise.all([
                    fetch('http://localhost:3000/api/patients'),
                    fetch('http://localhost:3000/api/medics'),
                    fetch('http://localhost:3000/api/admins'),
                ]);

                if (!patientsRes.ok || !medicsRes.ok || !adminsRes.ok) {
                    throw new Error('Falha ao carregar usuários');
                }

                const [patientsData, medicsData, adminsData] = await Promise.all([
                    patientsRes.json(),
                    medicsRes.json(),
                    adminsRes.json(),
                ]);

                const normalizedUsers: UserItem[] = [
                    ...patientsData.map((user: any) => ({
                        id: `patient-${user.id}`,
                        backendId: String(user.id),
                        name: user.name,
                        email: user.email,
                        role: 'patient' as UserType,
                        active: user.active !== undefined ? Boolean(user.active) : true,
                        phone: user.phone,
                        cpf: user.cpf,
                    })),
                    ...medicsData.map((user: any) => ({
                        id: `medic-${user.id}`,
                        backendId: String(user.id),
                        name: user.name,
                        email: user.email,
                        role: 'medic' as UserType,
                        active: user.active !== undefined ? Boolean(user.active) : true,
                        phone: user.phone,
                        cpf: user.cpf,
                    })),
                    ...adminsData.map((user: any) => ({
                        id: `admin-${user.id}`,
                        backendId: String(user.id),
                        name: user.name,
                        email: user.email,
                        role: 'admin' as UserType,
                        active: user.active !== undefined ? Boolean(user.active) : true,
                        phone: user.phone,
                        cpf: user.cpf,
                    })),
                ];

                setUsers(normalizedUsers);
            } catch (fetchError) {
                console.error(fetchError);
                setError('Não foi possível carregar os usuários');
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    const toggleActive = async (compositeId: string) => {
        const user = users.find((u) => u.id === compositeId);
        if (!user) {
            return;
        }

        const nextActive = !user.active;
        const backendId = user.backendId ?? compositeId;
        let endpoint = '';

        switch (user.role) {
            case 'patient':
                endpoint = `/api/patients/${backendId}`;
                break;
            case 'medic':
                endpoint = `/api/medics/${backendId}`;
                break;
            case 'admin':
                endpoint = `/api/admins/${backendId}`;
                break;
            default:
                console.warn('Tipo de usuário não suportado para toggle:', user.role);
                setConfirmToggleUser(null);
                return;
        }

        try {
            const res = await fetch(`http://localhost:3000${endpoint}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: nextActive }),
            });

            if (!res.ok) {
                throw new Error('Erro ao atualizar status do usuário');
            }

            setUsers((prev) =>
                prev.map((u) =>
                    u.id === compositeId
                        ? { ...u, active: nextActive }
                        : u
                )
            );
        } catch (patchError) {
            console.error(patchError);
            setError('Não foi possível atualizar o status do usuário');
        } finally {
            setConfirmToggleUser(null);
        }
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

            {loading ? (
                <div className="text-center py-12 text-muted-foreground">Carregando usuários...</div>
            ) : error ? (
                <div className="text-center py-12 text-red-600">{error}</div>
            ) : users.filter((u) => roleFilter === "all" || u.role === roleFilter).length === 0 ? (
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
                                    disabled={savingEdit}
                                    onClick={async () => {
                                        if (!editingUser) return;
                                        setSavingEdit(true);
                                        setError(null);

                                        const backendId = editingUser.backendId ?? editingUser.id;
                                        let endpoint = '';
                                        switch (editingUser.role) {
                                            case 'patient':
                                                endpoint = `/api/patients/${backendId}`;
                                                break;
                                            case 'medic':
                                                endpoint = `/api/medics/${backendId}`;
                                                break;
                                            case 'admin':
                                                endpoint = `/api/admins/${backendId}`;
                                                break;
                                            default:
                                                setError('Tipo de usuário inválido');
                                                setSavingEdit(false);
                                                return;
                                        }

                                        try {
                                            const res = await fetch(`http://localhost:3000${endpoint}`, {
                                                method: 'PATCH',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    name: editingUser.name,
                                                    email: editingUser.email,
                                                    phone: editingUser.phone,
                                                    cpf: editingUser.cpf,
                                                }),
                                            });

                                            if (!res.ok) {
                                                throw new Error('Falha ao salvar usuário');
                                            }

                                            setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? editingUser : u)));
                                            setEditingUser(null);
                                        } catch (e) {
                                            console.error(e);
                                            setError('Não foi possível salvar as alterações');
                                        } finally {
                                            setSavingEdit(false);
                                        }
                                    }}
                                >
                                    {savingEdit ? 'Salvando...' : 'Salvar'}
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
