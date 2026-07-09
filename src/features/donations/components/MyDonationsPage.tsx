import { Link } from 'react-router-dom';
import { UI_MESSAGES } from '@/constants/messages.constants';

const MOCK_DONATIONS = [
  { id: '1', title: 'Abrigos para invierno', status: 'Pendiente', date: '20 Oct, 2026' },
  { id: '2', title: 'Utiles escolares', status: 'En camino', date: '12 Nov, 2026' },
];

// Entrada:
// Ninguna.

// Proceso:
// Renderiza listado de aportes del donante (mock).

// Salida:
// Retorna el elemento JSX de mis aportes.
export function MyDonationsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-3xl font-bold">{UI_MESSAGES.NAV_MY_COMMITMENTS}</h1>
      <div className="overflow-hidden rounded-xl border border-border-default bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border-default bg-vivid-50">
            <tr>
              <th className="px-6 py-4 font-semibold">Aporte</th>
              <th className="px-6 py-4 font-semibold">Estado</th>
              <th className="px-6 py-4 font-semibold">Fecha</th>
              <th className="px-6 py-4 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {MOCK_DONATIONS.map((d) => (
              <tr key={d.id} className="border-b border-border-default last:border-0">
                <td className="px-6 py-4">{d.title}</td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-vivid-200 px-3 py-1 text-vivid-700">{d.status}</span>
                </td>
                <td className="px-6 py-4 text-text-muted">{d.date}</td>
                <td className="px-6 py-4">
                  <Link to={`/my-donations/${d.id}`} className="font-medium text-vivid-700">
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
