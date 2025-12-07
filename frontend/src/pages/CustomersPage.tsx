import React, { useMemo, useState } from "react";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  segment: "Retail" | "Wholesale" | "Online";
  totalSpend: number;
  lastOrderDaysAgo: number;
  ordersCount: number;
};

const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "Aarav Shah",
    email: "aarav.shah@example.com",
    phone: "+91 98765 12345",
    segment: "Retail",
    totalSpend: 42500,
    lastOrderDaysAgo: 3,
    ordersCount: 12,
  },
  {
    id: 2,
    name: "Greenfield Stores",
    email: "contact@greenfieldstores.com",
    phone: "+91 98221 45678",
    segment: "Wholesale",
    totalSpend: 188000,
    lastOrderDaysAgo: 10,
    ordersCount: 32,
  },
  {
    id: 3,
    name: "Riya Desai",
    email: "riya.desai@example.com",
    phone: "+91 98980 98765",
    segment: "Online",
    totalSpend: 16500,
    lastOrderDaysAgo: 1,
    ordersCount: 5,
  },
  {
    id: 4,
    name: "Urban Mart",
    email: "accounts@urbanmart.in",
    phone: "+91 98111 22233",
    segment: "Retail",
    totalSpend: 93500,
    lastOrderDaysAgo: 45,
    ordersCount: 20,
  },
  {
    id: 5,
    name: "Global Traders",
    email: "sales@globaltraders.in",
    phone: "+91 99001 11223",
    segment: "Wholesale",
    totalSpend: 240000,
    lastOrderDaysAgo: 5,
    ordersCount: 41,
  },
];

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState<
    "All" | "Retail" | "Wholesale" | "Online"
  >("All");

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newSegment, setNewSegment] = useState<
    "Retail" | "Wholesale" | "Online"
  >("Retail");

  // Derived stats
  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.lastOrderDaysAgo <= 30).length;
    const highValue = customers.filter((c) => c.totalSpend >= 100000).length;
    const totalRevenue = customers.reduce(
      (sum, c) => sum + c.totalSpend,
      0
    );

    return { total, active, highValue, totalRevenue };
  }, [customers]);

  // Filtered list
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());

      const matchSegment =
        segmentFilter === "All" ? true : c.segment === segmentFilter;

      return matchSearch && matchSegment;
    });
  }, [customers, search, segmentFilter]);

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const nextId =
      customers.length > 0
        ? Math.max(...customers.map((c) => c.id)) + 1
        : 1;

    const newCustomer: Customer = {
      id: nextId,
      name: newName.trim(),
      email: newEmail.trim(),
      phone: "N/A",
      segment: newSegment,
      totalSpend: 0,
      lastOrderDaysAgo: 999,
      ordersCount: 0,
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    setNewName("");
    setNewEmail("");
    setNewSegment("Retail");
  };

  return (
    <div className="customers-page">
      {/* Header */}
      <div className="customers-header">
        <div>
          <h1 className="customers-title">Customers</h1>
          <p className="customers-subtitle">
            View key customers, their spending, and segments at a glance.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="customers-stats-row">
        <div className="customers-stat-card">
          <span className="customers-stat-label">Total customers</span>
          <span className="customers-stat-value">{stats.total}</span>
          <span className="customers-stat-subtitle">
            Across all segments
          </span>
        </div>

        <div className="customers-stat-card">
          <span className="customers-stat-label">Active in last 30 days</span>
          <span className="customers-stat-value">{stats.active}</span>
          <span className="customers-stat-subtitle">
            Recently engaged customers
          </span>
        </div>

        <div className="customers-stat-card">
          <span className="customers-stat-label">High-value clients</span>
          <span className="customers-stat-value">{stats.highValue}</span>
          <span className="customers-stat-subtitle">
            Spend ≥ ₹100,000 lifetime
          </span>
        </div>

        <div className="customers-stat-card customers-stat-accent">
          <span className="customers-stat-label">Total customer revenue</span>
          <span className="customers-stat-value">
            ₹{stats.totalRevenue.toLocaleString("en-IN")}
          </span>
          <span className="customers-stat-subtitle">
            Lifetime tracked from this view
          </span>
        </div>
      </div>

      {/* Filters + Add */}
      <div className="customers-toolbar">
        <div className="customers-filters">
          <input
            className="customers-search"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="customers-select"
            value={segmentFilter}
            onChange={(e) =>
              setSegmentFilter(e.target.value as typeof segmentFilter)
            }
          >
            <option value="All">All segments</option>
            <option value="Retail">Retail</option>
            <option value="Wholesale">Wholesale</option>
            <option value="Online">Online</option>
          </select>
        </div>

        <form className="customers-add-form" onSubmit={handleAddCustomer}>
          <input
            className="customers-add-input"
            placeholder="Customer name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            className="customers-add-input"
            placeholder="Email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <select
            className="customers-add-select"
            value={newSegment}
            onChange={(e) =>
              setNewSegment(e.target.value as Customer["segment"])
            }
          >
            <option value="Retail">Retail</option>
            <option value="Wholesale">Wholesale</option>
            <option value="Online">Online</option>
          </select>
          <button className="customers-add-button" type="submit">
            Add customer
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="customers-table-card">
        <div className="customers-table-header">
          <span className="customers-table-title">Customer list</span>
          <span className="customers-table-meta">
            {filteredCustomers.length} of {customers.length} customers shown
          </span>
        </div>

        <div className="customers-table-wrapper">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Name & email</th>
                <th>Segment</th>
                <th>Total spend</th>
                <th>Orders</th>
                <th>Last order</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="customers-empty">
                    No customers match the current filters.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="customers-name-cell">
                        <span className="customers-name">{c.name}</span>
                        <span className="customers-email">{c.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className="customers-segment-pill">
                        {c.segment}
                      </span>
                    </td>
                    <td>₹{c.totalSpend.toLocaleString("en-IN")}</td>
                    <td>{c.ordersCount}</td>
                    <td>
                      {c.lastOrderDaysAgo === 0
                        ? "Today"
                        : `${c.lastOrderDaysAgo} days ago`}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
