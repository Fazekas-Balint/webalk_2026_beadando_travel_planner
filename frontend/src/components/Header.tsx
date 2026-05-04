import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Compass, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { logout as logoutApi } from '../services/auth';
import { useState, useRef, useEffect } from 'react';

export function Header() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickAway(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickAway);
    return () => document.removeEventListener('mousedown', onClickAway);
  }, []);

  async function handleLogout() {
    await logoutApi();
    clear();
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/trips" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent text-white">
            <Compass className="h-5 w-5" />
          </span>
          <span className="font-serif text-xl font-semibold">TripPlanner</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink
            to="/trips"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive ? 'bg-bg text-ink' : 'text-ink-muted hover:text-ink'
              }`
            }
          >
            Útjaim
          </NavLink>
          <NavLink
            to="/trips/new"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive ? 'bg-bg text-ink' : 'text-ink-muted hover:text-ink'
              }`
            }
          >
            Új út
          </NavLink>
        </nav>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium hover:bg-bg"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-accent/10 text-accent">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </span>
            <span className="hidden sm:inline">{user?.name ?? 'Felhasználó'}</span>
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
              <div className="border-b border-border px-4 py-3">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-ink-muted">{user?.email}</div>
              </div>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-bg"
              >
                <UserIcon className="h-4 w-4" />
                Profil
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm hover:bg-bg"
              >
                <LogOut className="h-4 w-4" />
                Kijelentkezés
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
