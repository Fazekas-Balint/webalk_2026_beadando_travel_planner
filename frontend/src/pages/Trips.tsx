import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Calendar, MapPin, Plus, Loader2, Compass } from 'lucide-react';
import { listTrips } from '../services/trips';
import { apiErrorMessage } from '../lib/api';
import { formatDateRange, tripDays } from '../lib/format';
import { useAuthStore } from '../store/auth';
import { TripCover } from '../components/TripCover';
import type { Trip } from '../types';

export function TripsPage() {
  const user = useAuthStore((s) => s.user);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listTrips()
      .then((data) => {
        if (!cancelled) setTrips(data);
      })
      .catch((err) => {
        if (!cancelled) setError(apiErrorMessage(err, 'Az utak betöltése sikertelen'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalDays = trips.reduce((sum, t) => sum + tripDays(t.startDate, t.endDate), 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-ink-muted">Szia, {user?.name?.split(' ')[0] ?? 'utazó'} 👋</p>
          <h1 className="mt-1 text-4xl font-semibold">Útjaim</h1>
          {trips.length > 0 && (
            <p className="mt-2 text-ink-muted">
              {trips.length} út tervezve · {totalDays} nap összesen
            </p>
          )}
        </div>
        <Link to="/trips/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Új út tervezése
        </Link>
      </div>

      <div className="mt-10">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
        ) : trips.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TripCard({ trip }: { trip: Trip }) {
  const days = tripDays(trip.startDate, trip.endDate);
  return (
    <Link
      to={`/trips/${trip.id}`}
      className="group card overflow-hidden transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <TripCover
        seed={trip.id + trip.destination}
        imageUrl={trip.coverImage}
        className="h-44"
      >
        <div className="absolute right-4 top-4 rounded-full bg-white/25 px-3 py-1 text-xs font-medium text-white shadow-sm backdrop-blur">
          {days} nap
        </div>
        <div className="absolute bottom-3 left-4 right-4 flex items-center gap-1.5 text-xs font-medium text-white/90 drop-shadow">
          <MapPin className="h-3.5 w-3.5" />
          {trip.destination}
        </div>
      </TripCover>
      <div className="p-5">
        <h3 className="text-lg font-semibold leading-snug">{trip.title}</h3>
        <div className="mt-2 flex items-center gap-1.5 text-sm text-ink-muted">
          <Calendar className="h-3.5 w-3.5" />
          {formatDateRange(trip.startDate, trip.endDate)}
        </div>
      </div>
    </Link>
  );
}

function LoadingState() {
  return (
    <div className="grid place-items-center py-24 text-ink-muted">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card grid place-items-center px-6 py-20 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-accent/10 text-accent">
        <Compass className="h-8 w-8" />
      </div>
      <h2 className="mt-6 text-2xl font-semibold">Még nincs utad</h2>
      <p className="mt-2 max-w-md text-ink-muted">
        Indítsd el az első kalandod — megjelölöd a célállomást, a dátumokat, és máris megtervezhetjük napról napra.
      </p>
      <Link to="/trips/new" className="btn-primary mt-6">
        <Plus className="h-4 w-4" />
        Tervezem az első utam
      </Link>
    </div>
  );
}
