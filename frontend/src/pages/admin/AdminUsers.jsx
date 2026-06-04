import { Link } from "react-router-dom";

function AdminUsers() {
  const users = [
    {
      id: 1,
      full_name: "Admin User",
      email: "admin@broastchasers.com",
      contact: "0307-111-78-69",
      role: "Admin",
      branch: "BROAST CHASERS",
      status: "Active"
    }
  ];

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

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
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
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.contact}</td>
                <td>{user.role}</td>
                <td>{user.branch}</td>
                <td>{user.status}</td>
                <td>
                  <Link to={`/admin/users/${user.id}`}>
                    <button className="secondary-btn">Edit</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;