import { Link, useNavigate } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import { Compass, Loader2 } from 'lucide-react';
import { register } from '../services/auth';
import { apiErrorMessage } from '../lib/api';
import { useAuthStore } from '../store/auth';

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await register(email, password, name);
      setAuth(res.user, res.accessToken);
      navigate('/trips', { replace: true });
    } catch (err) {
      setError(apiErrorMessage(err, 'A regisztráció nem sikerült'));
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

          <h1 className="text-3xl font-semibold">Hozz létre fiókot</h1>
          <p className="mt-2 text-ink-muted">30 másodperc, nincs bankkártya.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="label" htmlFor="name">Név</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
              />
            </div>
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
                autoComplete="new-password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="mt-1.5 text-xs text-ink-muted">
                Legalább 8 karakter, 1 nagybetű, 1 szám.
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Regisztráció
            </button>
          </form>

          <p className="mt-8 text-sm text-ink-muted">
            Van már fiókod?{' '}
            <Link to="/login" className="font-medium text-accent hover:underline">
              Bejelentkezés
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500" />
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_70%_30%,white,transparent_60%)]" />
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <h2 className="font-serif text-5xl leading-tight">
            Egy hely<br />minden utadnak.
          </h2>
          <p className="mt-4 max-w-md text-white/80">
            Térkép, napi terv, költség, jegyzetek — szervezd minden élményed egy helyre.
          </p>
        </div>
      </div>
    </div>
  );
}
