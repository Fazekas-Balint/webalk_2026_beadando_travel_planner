export type User = {
  id: string;
  email: string;
  name: string;
};

export type AuthMePayload = {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
};

export type Activity = {
  id: string;
  dayId: string;
  title: string;
  time: string | null;
  lat: number | null;
  lng: number | null;
  address: string | null;
  notes: string | null;
  cost: number | null;
  order: number;
};

export type Day = {
  id: string;
  tripId: string;
  date: string;
  order: number;
  activities?: Activity[];
};

export type Trip = {
  id: string;
  userId: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  coverImage: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  days?: Day[];
};

export type CreateTripInput = {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  isPublic?: boolean;
  coverImage?: string;
};

export type CreateActivityInput = {
  dayId: string;
  title: string;
  time?: string | null;
  lat?: number | null;
  lng?: number | null;
  address?: string | null;
  notes?: string | null;
  cost?: number | null;
  order: number;
};

export type UpdateActivityInput = Partial<CreateActivityInput>;
