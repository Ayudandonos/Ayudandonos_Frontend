import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { healthService } from '@/services';
import type { HealthCheck } from '@/types';
import { UI_MESSAGES } from '@/constants/messages.constants';

// Entrada:
// Ninguna.

// Proceso:
// Renderiza la página de inicio, consulta el estado de la API y muestra las secciones principales.

// Salida:
// Retorna el elemento JSX de la página de inicio.
export function HomePage() {
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    healthService
      .check()
      .then(setHealth)
      .catch(() => setError(UI_MESSAGES.HOME_API_ERROR));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {UI_MESSAGES.HOME_HERO_TITLE}{' '}
          <span className="text-primary-600">{UI_MESSAGES.HOME_HERO_HIGHLIGHT}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          {UI_MESSAGES.HOME_HERO_DESCRIPTION}
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg">{UI_MESSAGES.HOME_CTA_DONATE}</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">
              {UI_MESSAGES.HOME_CTA_FOUNDATION}
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-3">
        {UI_MESSAGES.HOME_FEATURES.map((item) => (
          <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        {health && (
          <p className="text-sm text-green-600">
            {UI_MESSAGES.HOME_API_CONNECTED(health.version, health.environment)}
          </p>
        )}
        {error && <p className="text-sm text-amber-600">{error}</p>}
      </div>
    </div>
  );
}
