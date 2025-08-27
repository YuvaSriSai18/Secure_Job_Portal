import { useEffect, useState } from "react";
import * as API from "@/apis/index";
import { Button } from "@/components/ui/button";
// import { Select } from "@/components/ui/select";
// import { useSelector } from "react-redux";
// import { selectUserData } from "@/reducers/auth/authSlice";
import type { User } from "@/utils/types";

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roleEditingId, setRoleEditingId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>("candidate");

  // const userData = useSelector(selectUserData);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.getAllUsers();
      setUsers(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update role
  const handleRoleUpdate = async (userId: string) => {
    try {
      setLoading(true);
      await API.updateUserRole(userId, { role: newRole });
      setRoleEditingId(null);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || "Role update failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      setLoading(true);
      await API.deleteUser(userId);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Users</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="overflow-x-auto bg-white p-4 rounded-md border">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Role</th>
              <th className="border px-2 py-1">Email Verified</th>
              <th className="border px-2 py-1">Last Login</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="border px-2 py-1">{user.name}</td>
                  <td className="border px-2 py-1">{user.email}</td>
                  <td className="border px-2 py-1">
                    {roleEditingId === user._id ? (
                      <div className="flex gap-2">
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          className="border rounded-md p-2"
                        >
                          <option value="admin">Admin</option>
                          <option value="hr">HR</option>
                          <option value="employee">Employee</option>
                          <option value="candidate">Candidate</option>
                        </select>

                        <Button
                          size="sm"
                          onClick={() => handleRoleUpdate(user._id!)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setRoleEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        {user.role}
                        <Button
                          size="sm"
                          onClick={() => {
                            setRoleEditingId(user._id!);
                            setNewRole(user.role);
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    )}
                  </td>
                  <td className="border px-2 py-1">
                    {user.emailVerified ? "Yes" : "No"}
                  </td>
                  <td className="border px-2 py-1">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString()
                      : "-"}
                  </td>
                  <td className="border px-2 py-1 flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(user._id!)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
