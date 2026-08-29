import React from 'react';
import { usersMock } from '../../mocks/expensesData';

const roleColor = {
    Propietario: 'badge-info',
    Administrador: 'badge-success',
    Empleado: 'badge-neutral',
    Contador: 'badge-warning',
    Supervisor: 'badge-neutral',
};

const UserList = () => (
    <div className="flex flex-col gap-6">
        <div>
            <p className="eyebrow mb-2">Gestión</p>
            <h2 className="text-xl">Usuarios</h2>
        </div>

        <div className="card p-0 overflow-hidden">
            <table className="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Rol</th>
                    </tr>
                </thead>
                <tbody>
                    {usersMock.map(u => (
                        <tr key={u.id}>
                            <td className="font-medium">{u.name}</td>
                            <td className="text-secondary">{u.email}</td>
                            <td><span className={`badge ${roleColor[u.role]}`}>{u.role}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default UserList;