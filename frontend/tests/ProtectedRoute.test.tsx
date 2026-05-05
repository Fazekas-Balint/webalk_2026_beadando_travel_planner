import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../src/components/ProtectedRoute';
import { useAuthStore } from '../src/store/auth';

function Harness({ initialPath }: { initialPath: string }) {
  return (
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/secret" element={<div>Secret Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuthStore.getState().clear();
  });

  it('redirects unauthenticated users to /login', () => {
    render(<Harness initialPath="/secret" />);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
  });

  it('renders the protected page when authenticated', () => {
    useAuthStore.getState().setAuth(
      { id: '1', email: 'a@b.c', name: 'A' },
      'access-token'
    );

    render(<Harness initialPath="/secret" />);
    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });
});
