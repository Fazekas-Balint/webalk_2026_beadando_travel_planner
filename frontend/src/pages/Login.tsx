import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import { Compass, Loader2 } from 'lucide-react';
import { login } from '../services/auth';
import { apiErrorMessage } from '../lib/api';
import { useAuthStore } from '../store/auth';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? '/trips';

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(email, password);
      setAuth(res.user, res.accessToken);
      navigate(from, { replace: true });
    } catch (err) {
      setError(apiErrorMessage(err, 'Hibás email vagy jelszó'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-8 py-16 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="mb-12 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-white">
              <Compass className="h-5 w-5" />
            </span>
            <span className="font-serif text-2xl font-semibold">TripPlanner</span>
          </Link>

          <h1 className="text-3xl font-semibold">Bejelentkezés</h1>
          <p className="mt-2 text-ink-muted">Lépj be, és tervezzük meg a következő utad.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="password">Jelszó</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Bejelentkezés
            </button>
          </form>

          <p className="mt-8 text-sm text-ink-muted">
            Nincs még fiókod?{' '}
            <Link to="/register" className="font-medium text-accent hover:underline">
              Regisztrálj
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-amber-500 to-rose-400" />
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_20%,white,transparent_60%)]" />
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <h2 className="font-serif text-5xl leading-tight">
            Tervezd meg a<br />következő kalandod.
          </h2>
          <p className="mt-4 max-w-md text-white/80">
            Térképes napi tervezés, költségbecslés, megosztható útitervek — egy helyen.
          </p>
        </div>
      </div>
    </div>
  );
}
