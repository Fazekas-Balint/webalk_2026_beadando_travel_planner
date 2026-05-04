import { Link, useNavigate } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { createTrip } from '../services/trips';
import { apiErrorMessage } from '../lib/api';

export function NewTripPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (new Date(endDate) < new Date(startDate)) {
      setError('A vége dátum nem lehet korábbi mint a kezdete.');
      return;
    }

    setLoading(true);
    try {
      const trip = await createTrip({ title, destination, startDate, endDate });
      navigate(`/trips/${trip.id}`, { replace: true });
    } catch (err) {
      setError(apiErrorMessage(err, 'Az út létrehozása sikertelen'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link to="/trips" className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" />
        Vissza az utakhoz
      </Link>

      <div className="card p-8">
        <h1 className="text-3xl font-semibold">Új út</h1>
        <p className="mt-2 text-ink-muted">
          Add meg az alapokat — a napok automatikusan létrejönnek a dátumtartomány alapján.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="title" className="label">Cím</label>
            <input
              id="title"
              className="input"
              placeholder="pl. Bécsi hétvége"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
            />
          </div>

          <div>
            <label htmlFor="destination" className="label">Célállomás</label>
            <input
              id="destination"
              className="input"
              placeholder="pl. Bécs, Ausztria"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              maxLength={100}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="start" className="label">Kezdet</label>
              <input
                id="start"
                type="date"
                className="input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="end" className="label">Vége</label>
              <input
                id="end"
                type="date"
                className="input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                min={startDate || undefined}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Link to="/trips" className="btn-secondary">Mégse</Link>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Út létrehozása
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
