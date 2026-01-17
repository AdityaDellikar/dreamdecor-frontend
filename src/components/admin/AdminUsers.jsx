import { useEffect, useState } from "react";
import api from "../../api/apiClient";
import AdminLayout from "./AdminLayout";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/admin/users").then((res) => setUsers(res.data.users));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <table className="w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="border-b text-left">
            <th className="p-4">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b">
              <td className="p-4">{u.name}</td>
              <td>{u.email}</td>
              <td className="capitalize">{u.role}</td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}