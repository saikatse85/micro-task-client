"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH USERS
  // =========================
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/users");

      const data = await res.json();

      setUsers(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      console.log(error);

      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // UPDATE ROLE
  // =========================
  const handleRoleChange = async (email, role) => {
    try {
      const res = await fetch("/api/users/update-role", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          role,
        }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("Success", "Role updated", "success");

        fetchUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // DELETE USER
  // =========================
  const handleDelete = async (email) => {
    const confirm = await Swal.fire({
      title: "Delete User?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("/api/users/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("Deleted", "User removed", "success");

        fetchUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return <div className="p-6 text-center font-bold">Loading users...</div>;
  }

  return (
    <div className="p-6">
      {/* TITLE */}
      <h1 className="text-3xl font-black mb-6">Manage Users</h1>

      {/* EMPTY */}
      {users.length === 0 && <p>No users found</p>}

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border rounded-xl overflow-hidden">
          <thead className="bg-emerald-500 text-white">
            <tr>
              <th className="p-3 text-left">Name</th>

              <th className="p-3 text-left">Email</th>

              <th className="p-3 text-left">Role</th>

              <th className="p-3 text-left">Coins</th>

              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                {/* NAME */}
                <td className="p-3">{user.name}</td>

                {/* EMAIL */}
                <td className="p-3">{user.email}</td>

                {/* ROLE */}
                <td className="p-3">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.email, e.target.value)
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="worker">worker</option>

                    <option value="buyer">buyer</option>

                    <option value="admin">admin</option>
                  </select>
                </td>

                {/* COINS */}
                <td className="p-3">{user.coin}</td>

                {/* ACTION */}
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDelete(user.email)}
                    className="
                      px-4 py-2 rounded-lg
                      bg-red-500 text-white
                    "
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
