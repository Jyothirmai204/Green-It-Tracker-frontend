import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/', label: 'Overview', end: true },
  { to: '/resources', label: 'Resources' },
  { to: '/sustainability', label: 'Sustainability' },
  { to: '/paperless', label: 'Paperless' },
  { to: '/recommendations', label: 'Recommendations' },
];

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">Green IT<br />Tracker</span>
        </div>

        <nav className="nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => 'nav-link' + (isActive ? ' nav-link--active' : '')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="sidebar-user">
            <div className="sidebar-user-name">{user?.fullName}</div>
            <div className="sidebar-user-email">{user?.email}</div>
          </div>
          <button className="btn btn--ghost btn--block" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
