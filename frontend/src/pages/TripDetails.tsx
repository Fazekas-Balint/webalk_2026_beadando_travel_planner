import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Plus,
  Loader2,
  Trash2,
  Pencil,
  Clock,
  Wallet,
} from 'lucide-react';
import { deleteActivity, deleteTrip, getTrip } from '../services/trips';
import { apiErrorMessage } from '../lib/api';
import { formatDateLong, formatCost, formatDateRange, tripDays } from '../lib/format';
import type { Activity, Day, Trip } from '../types';
import { TripMap } from '../components/TripMap';
import { ActivityModal } from '../components/ActivityModal';
import { TripCover } from '../components/TripCover';

export function TripDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [defaultDayId, setDefaultDayId] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    getTrip(id)
      .then((data) => {
        if (!cancelled) setTrip(data);
      })
      .catch((err) => {
        if (!cancelled) setError(apiErrorMessage(err, 'Az út nem található'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const allActivities: Activity[] = useMemo(() => {
    if (!trip?.days) return [];
    return trip.days.flatMap((d) => d.activities ?? []);
  }, [trip]);

  const totalCost = allActivities.reduce((sum, a) => sum + (a.cost ?? 0), 0);

  function openAdd(dayId: string) {
    setEditingActivity(null);
    setDefaultDayId(dayId);
    setModalOpen(true);
  }

  function openEdit(activity: Activity) {
    setEditingActivity(activity);
    setDefaultDayId(activity.dayId);
    setModalOpen(true);
  }

  function handleSaved(saved: Activity) {
    setTrip((prev) => {
      if (!prev?.days) return prev;
      const days: Day[] = prev.days.map((day) => {
        const existing = (day.activities ?? []).filter((a) => a.id !== saved.id);
        if (day.id === saved.dayId) {
          return { ...day, activities: [...existing, saved].sort((a, b) => a.order - b.order) };
        }
        return { ...day, activities: existing };
      });
      return { ...prev, days };
    });
  }

  async function handleDeleteActivity(a: Activity) {
    if (!confirm('Biztosan törlöd ezt a programot?')) return;
    try {
      await deleteActivity(a.id);
      setTrip((prev) => {
        if (!prev?.days) return prev;
        const days: Day[] = prev.days.map((day) => ({
          ...day,
          activities: (day.activities ?? []).filter((x) => x.id !== a.id),
        }));
        return { ...prev, days };
      });
    } catch (err) {
      alert(apiErrorMessage(err, 'A törlés nem sikerült'));
    }
  }

  async function handleDeleteTrip() {
    if (!trip) return;
    if (!confirm(`Biztosan törlöd a(z) "${trip.title}" utat? Ez nem visszavonható.`)) return;
    try {
      await deleteTrip(trip.id);
      navigate('/trips', { replace: true });
    } catch (err) {
      alert(apiErrorMessage(err, 'A törlés nem sikerült'));
    }
  }

  if (loading) {
    return (
      <div className="grid place-items-center py-24 text-ink-muted">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error ?? 'Az út nem elérhető.'}
        </div>
        <Link to="/trips" className="btn-secondary mt-6">
          <ArrowLeft className="h-4 w-4" />
          Vissza
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <Link to="/trips" className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" />
        Vissza az utakhoz
      </Link>

      <div className="card overflow-hidden">
        <TripCover
          seed={trip.id + trip.destination}
          imageUrl={trip.coverImage}
          className="h-64 sm:h-72"
        >
          <div className="absolute bottom-5 left-6 right-6 flex flex-wrap items-end justify-between gap-4 text-white">
            <div>
              <h1 className="font-serif text-3xl font-semibold drop-shadow-md sm:text-4xl">{trip.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/95 drop-shadow">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {trip.destination}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDateRange(trip.startDate, trip.endDate)} · {tripDays(trip.startDate, trip.endDate)} nap
                </span>
              </div>
            </div>
            <button onClick={handleDeleteTrip} className="rounded-xl bg-white/20 px-3 py-2 text-sm text-white backdrop-blur hover:bg-white/30">
              <Trash2 className="mr-1 inline h-4 w-4" />
              Út törlése
            </button>
          </div>
        </TripCover>

        <div className="grid gap-4 border-b border-border bg-bg/50 px-6 py-4 sm:grid-cols-3">
          <Stat label="Napok" value={String(tripDays(trip.startDate, trip.endDate))} />
          <Stat label="Programok" value={String(allActivities.length)} />
          <Stat label="Becsült költség" value={totalCost > 0 ? formatCost(totalCost) : '—'} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <h2 className="mb-4 text-xl font-semibold">Útiterv</h2>
          <div className="space-y-4">
            {trip.days?.map((day, idx) => (
              <DayCard
                key={day.id}
                day={day}
                index={idx}
                onAdd={() => openAdd(day.id)}
                onEdit={openEdit}
                onDelete={handleDeleteActivity}
              />
            ))}
          </div>
        </section>

        <section className="lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold">Térkép</h2>
          <div className="card sticky top-20 overflow-hidden">
            <TripMap activities={allActivities} />
          </div>
        </section>
      </div>

      <ActivityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        tripId={trip.id}
        days={trip.days ?? []}
        defaultDayId={defaultDayId}
        activity={editingActivity}
        onSaved={handleSaved}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-ink-muted">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

function DayCard({
  day,
  index,
  onAdd,
  onEdit,
  onDelete,
}: {
  day: Day;
  index: number;
  onAdd: () => void;
  onEdit: (a: Activity) => void;
  onDelete: (a: Activity) => void;
}) {
  const acts = day.activities ?? [];
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-accent">{index + 1}. nap</div>
          <div className="text-base font-semibold">{formatDateLong(day.date)}</div>
        </div>
        <button onClick={onAdd} className="btn-ghost px-3 py-2 text-sm">
          <Plus className="h-4 w-4" />
          Program
        </button>
      </div>

      {acts.length === 0 ? (
        <div className="px-5 py-6 text-sm text-ink-muted">
          Még nincs program ezen a napon.
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {acts.map((a) => (
            <ActivityRow key={a.id} activity={a} onEdit={() => onEdit(a)} onDelete={() => onDelete(a)} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ActivityRow({
  activity,
  onEdit,
  onDelete,
}: {
  activity: Activity;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <li className="group flex items-start gap-4 px-5 py-4 transition hover:bg-bg/60">
      <div className="flex w-16 flex-col items-center gap-1 pt-0.5">
        <Clock className="h-4 w-4 text-ink-muted" />
        <span className="text-xs text-ink-muted">{activity.time ?? '—'}</span>
      </div>
      <div className="flex-1">
        <div className="font-medium">{activity.title}</div>
        {activity.address && (
          <div className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
            <MapPin className="h-3 w-3" />
            {activity.address}
          </div>
        )}
        {activity.notes && (
          <p className="mt-1.5 text-sm text-ink-muted">{activity.notes}</p>
        )}
        {activity.cost != null && activity.cost > 0 && (
          <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-bg px-2 py-0.5 text-xs text-ink-muted">
            <Wallet className="h-3 w-3" />
            {formatCost(activity.cost)}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
        <button onClick={onEdit} className="rounded-lg p-2 hover:bg-bg" aria-label="Szerkesztés">
          <Pencil className="h-4 w-4" />
        </button>
        <button onClick={onDelete} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label="Törlés">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
