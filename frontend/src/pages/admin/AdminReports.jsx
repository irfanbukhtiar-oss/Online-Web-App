import { Link } from "react-router-dom";

function AdminReports() {
  const reports = [
    {
      title: "Item Wise Sale Report",
      icon: "☰",
      path: "/admin/reports/item-wise-sale"
    },
    {
      title: "Addon Wise Sale Report",
      icon: "🧩",
      path: "/admin/reports/addon-wise-sale"
    },
    {
      title: "Transaction Report",
      icon: "↪",
      path: "/admin/reports/transaction"
    },
    {
      title: "Category Wise Sale Report",
      icon: "▤",
      path: "/admin/reports/category-wise-sale"
    },
    {
      title: "Customer Ledger",
      icon: "👤",
      path: "/admin/reports/customer-ledger"
    },
    {
      title: "Supplier Ledger",
      icon: "👤",
      path: "/admin/reports/supplier-ledger"
    },
    {
      title: "Waiter Report",
      icon: "👥",
      path: "/admin/reports/waiter"
    },
    {
      title: "User Wise Sale Report",
      icon: "👤",
      path: "/admin/reports/user-wise-sale"
    },
    {
      title: "Supplier Wise Purchase Report",
      icon: "📋",
      path: "/admin/reports/supplier-wise-purchase"
    },
    {
      title: "Item Wise Location Transfer Report",
      icon: "📋",
      path: "/admin/reports/item-wise-location-transfer"
    },
    {
      title: "Location Wise Item Transfer Report",
      icon: "📋",
      path: "/admin/reports/location-wise-item-transfer"
    },
    {
      title: "Sales Summary",
      icon: "📋",
      path: "/admin/reports/sales-summary"
    },
    {
      title: "Discount Report",
      icon: "💳",
      path: "/admin/reports/discount"
    },
    {
      title: "Customer Wise Sale Report",
      icon: "📋",
      path: "/admin/reports/customer-wise-sale"
    },
    {
      title: "Item Wise Recipe Consumption Report",
      icon: "📋",
      path: "/admin/reports/item-wise-recipe-consumption"
    },
    {
      title: "Item Wise Sale Details Report",
      icon: "📋",
      path: "/admin/reports/item-wise-sale-details"
    },
    {
      title: "Gross Profit Report",
      icon: "📋",
      path: "/admin/reports/gross-profit"
    },
    {
      title: "Payment Mode Wise Sale Report",
      icon: "📋",
      path: "/admin/reports/payment-mode-wise-sale"
    },
    {
      title: "Invoice Type Wise Sale Report",
      icon: "📋",
      path: "/admin/reports/invoice-type-wise-sale"
    },
    {
      title: "User Wise Item Sale Report",
      icon: "📋",
      path: "/admin/reports/user-wise-item-sale"
    },
    {
      title: "Item Wise Purchase Report",
      icon: "📋",
      path: "/admin/reports/item-wise-purchase"
    },
    {
      title: "Kitchen Wise Sale Report",
      icon: "📋",
      path: "/admin/reports/kitchen-wise-sale"
    },
    {
      title: "Hourly Wise Sale Report",
      icon: "📋",
      path: "/admin/reports/hourly-wise-sale",
      active: true
    },
    {
      title: "Deals Report",
      icon: "📋",
      path: "/admin/reports/deals"
    },
    {
      title: "Cancellation Report",
      icon: "📋",
      path: "/admin/reports/cancellation"
    },
    {
      title: "Kitchen Order Ready Time Report",
      icon: "📋",
      path: "/admin/reports/kitchen-order-ready-time"
    },
    {
      title: "P&L Report",
      icon: "◆",
      path: "/admin/reports/profit-loss"
    },
    {
      title: "Rider Report",
      icon: "📋",
      path: "/admin/reports/rider"
    },
    {
      title: "Shift Closing Report",
      icon: "▣",
      path: "/admin/reports/shift-closing"
    }
  ];

  return (
    <div className="admin-layout">
      <div className="admin-page-header">
        <h1>Reports</h1>
        <p>Select a report to view sales, customers, orders, payments, and operations.</p>
      </div>

      <div className="admin-actions">
        <Link to="/admin">
          <button className="secondary-btn">Back to Dashboard</button>
        </Link>

        <Link to="/admin/orders">
          <button className="primary-btn">Order History</button>
        </Link>
      </div>

      <div className="reports-grid">
        {reports.map((report) => (
          <Link
            key={report.title}
            to={report.path}
            className={report.active ? "report-card active" : "report-card"}
          >
            <div className="report-card-icon">{report.icon}</div>
            <div>{report.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AdminReports;