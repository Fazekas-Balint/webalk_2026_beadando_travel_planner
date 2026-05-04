import { useNavigate } from 'react-router-dom';
import { LogOut, Mail, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { logout } from '../services/auth';

export function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);

  async function handleLogout() {
    await logout();
    clear();
    navigate('/login');
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Profil</h1>
      <p className="mt-2 text-ink-muted">A fiókod adatai.</p>

      <div className="card mt-8 overflow-hidden">
        <div className="flex items-center gap-4 px-6 py-6">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-accent/10 text-2xl font-semibold text-accent">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div>
            <div className="text-xl font-semibold">{user?.name}</div>
            <div className="text-sm text-ink-muted">{user?.email}</div>
          </div>
        </div>

        <div className="border-t border-border">
          <Row icon={<UserIcon className="h-4 w-4" />} label="Név" value={user?.name ?? '—'} />
          <Row icon={<Mail className="h-4 w-4" />} label="Email" value={user?.email ?? '—'} />
        </div>
      </div>

      <div className="card mt-6 p-6">
        <button onClick={handleLogout} className="btn-secondary">
          <LogOut className="h-4 w-4" />
          Kijelentkezés
        </button>
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-6 py-4 last:border-b-0">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-bg text-ink-muted">{icon}</span>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-wide text-ink-muted">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
