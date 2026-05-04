import { useState, useEffect, type FormEvent } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { Activity, Day } from '../types';
import { createActivity, updateActivity } from '../services/trips';
import { apiErrorMessage } from '../lib/api';
import { formatDateLong } from '../lib/format';

type Props = {
  open: boolean;
  onClose: () => void;
  tripId: string;
  days: Day[];
  defaultDayId: string;
  activity: Activity | null;
  onSaved: (a: Activity) => void;
};

export function ActivityModal({ open, onClose, tripId, days, defaultDayId, activity, onSaved }: Props) {
  const [title, setTitle] = useState('');
  const [dayId, setDayId] = useState(defaultDayId);
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [cost, setCost] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(activity?.title ?? '');
      setDayId(activity?.dayId ?? defaultDayId);
      setTime(activity?.time ?? '');
      setAddress(activity?.address ?? '');
      setNotes(activity?.notes ?? '');
      setCost(activity?.cost != null ? String(activity.cost) : '');
      setError(null);
    }
  }, [open, activity, defaultDayId]);

  if (!open) return null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      dayId,
      title: title.trim(),
      time: time || null,
      address: address || null,
      notes: notes || null,
      cost: cost ? Number(cost) : null,
    };

    try {
      if (activity) {
        const updated = await updateActivity(activity.id, payload);
        onSaved(updated);
      } else {
        const day = days.find((d) => d.id === dayId);
        const order = (day?.activities?.length ?? 0);
        const created = await createActivity(tripId, { ...payload, order });
        onSaved(created);
      }
      onClose();
    } catch (err) {
      setError(apiErrorMessage(err, 'A mentés nem sikerült'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-6">
      <div className="card relative w-full max-w-lg overflow-hidden rounded-t-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold">
            {activity ? 'Program szerkesztése' : 'Új program'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-bg" aria-label="Bezárás">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label className="label" htmlFor="atitle">Cím</label>
            <input
              id="atitle"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
              placeholder="pl. Schönbrunn látogatás"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="aday">Nap</label>
              <select
                id="aday"
                className="input"
                value={dayId}
                onChange={(e) => setDayId(e.target.value)}
              >
                {days.map((d, idx) => (
                  <option key={d.id} value={d.id}>
                    {idx + 1}. nap — {formatDateLong(d.date)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="atime">Időpont</label>
              <input
                id="atime"
                type="time"
                className="input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="aaddr">Helyszín / cím</label>
            <input
              id="aaddr"
              className="input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="pl. Schloß Schönbrunn, Wien"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="acost">Költség (HUF)</label>
              <input
                id="acost"
                type="number"
                min={0}
                className="input"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="anotes">Jegyzet</label>
            <textarea
              id="anotes"
              className="input min-h-[88px] resize-y"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Egyéb infó, foglalás, meglátások..."
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Mégse
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {activity ? 'Mentés' : 'Hozzáadás'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
