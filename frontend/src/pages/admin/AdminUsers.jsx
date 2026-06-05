import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getUsers,
  deleteUser,
  toggleUserStatus
} from "../../services/userService";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.users || []);
    } catch (error) {
      console.error("Users loading error", error);
      alert("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggle = async (id) => {
    await toggleUserStatus(id);
    loadUsers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await deleteUser(id);
    loadUsers();
  };

  return (
    <div className="admin-layout">
      <div className="admin-page-header">
        <h1>Users</h1>
        <p>Manage staff accounts, access privileges, and branch assignment.</p>
      </div>

      <div className="admin-actions">
        <Link to="/admin">
          <button className="secondary-btn">Back to Dashboard</button>
        </Link>

        <Link to="/admin/users/new">
          <button className="primary-btn">+ Add User</button>
        </Link>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Branch</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="8">No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>{user.contact}</td>
                    <td>{user.role}</td>
                    <td>{user.default_branch}</td>
                    <td>{user.is_active ? "Active" : "Disabled"}</td>
                    <td>
                      <Link to={`/admin/users/${user.id}`}>
                        <button className="secondary-btn">Edit</button>
                      </Link>

                      <button
                        className="secondary-btn"
                        onClick={() => handleToggle(user.id)}
                      >
                        {user.is_active ? "Disable" : "Enable"}
                      </button>

                      <button
                        className="primary-btn"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;