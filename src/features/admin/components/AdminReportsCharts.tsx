import type { ReactNode } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { UI_MESSAGES } from '@/constants/messages.constants';
import type {
  AdminReportMonthlyItem,
  AdminReportSeriesItem,
} from '@/features/admin/types/admin.types';

const CHART_COLORS = ['#4d21e7', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#64748b'];

const SERIES_COLORS = {
  users: '#4d21e7',
  foundations: '#10b981',
  donations: '#3b82f6',
  campaigns: '#f59e0b',
} as const;

interface ChartCardProps {
  title: string;
  children: ReactNode;
  empty?: boolean;
}

/**
 * Entrada: title: titulo del panel; children: grafico; empty: sin datos.
 * Proceso: Envuelve un grafico Recharts en tarjeta con estado vacio opcional.
 * Salida: Retorna el elemento JSX de la tarjeta de grafico.
 */
function ChartCard({ title, children, empty = false }: ChartCardProps) {
  return (
    <Card glass={false} className="border border-border-default bg-white p-6">
      <h2 className="mb-4 text-heading text-text-primary">{title}</h2>
      {empty ? (
        <div className="flex h-64 items-center justify-center text-sm text-text-muted">
          {UI_MESSAGES.ADMIN_REPORTS_CHART_EMPTY}
        </div>
      ) : (
        <div className="h-72 w-full">{children}</div>
      )}
    </Card>
  );
}

interface AdminReportsChartsProps {
  usersByRole: AdminReportSeriesItem[];
  foundationsByStatus: AdminReportSeriesItem[];
  donationsByStatus: AdminReportSeriesItem[];
  campaignsByStatus: AdminReportSeriesItem[];
  monthlyActivity: AdminReportMonthlyItem[];
}

/**
 * Entrada: series: datos agregados para tortas, barras y lineas.
 * Proceso: Renderiza graficos Recharts de distribucion y actividad temporal.
 * Salida: Retorna el elemento JSX con el conjunto de diagramas.
 */
export function AdminReportsCharts({
  usersByRole,
  foundationsByStatus,
  donationsByStatus,
  campaignsByStatus,
  monthlyActivity,
}: AdminReportsChartsProps) {
  const hasMonthlyData = monthlyActivity.some(
    (item) => item.users + item.foundations + item.donations + item.campaigns > 0,
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title={UI_MESSAGES.ADMIN_REPORTS_USERS_BY_ROLE}
          empty={usersByRole.every((item) => item.value === 0)}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={usersByRole}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={2}
              >
                {usersByRole.map((entry, index) => (
                  <Cell
                    key={entry.key}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title={UI_MESSAGES.ADMIN_REPORTS_FOUNDATIONS_BY_STATUS}
          empty={foundationsByStatus.every((item) => item.value === 0)}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={foundationsByStatus}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={2}
              >
                {foundationsByStatus.map((entry, index) => (
                  <Cell
                    key={entry.key}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title={UI_MESSAGES.ADMIN_REPORTS_DONATIONS_BY_STATUS}
          empty={donationsByStatus.every((item) => item.value === 0)}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={donationsByStatus} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ebe6f5" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {donationsByStatus.map((entry, index) => (
                  <Cell
                    key={entry.key}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title={UI_MESSAGES.ADMIN_REPORTS_CAMPAIGNS_BY_STATUS}
          empty={campaignsByStatus.every((item) => item.value === 0)}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={campaignsByStatus} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ebe6f5" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {campaignsByStatus.map((entry, index) => (
                  <Cell
                    key={entry.key}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title={UI_MESSAGES.ADMIN_REPORTS_MONTHLY_ACTIVITY} empty={!hasMonthlyData}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyActivity} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ebe6f5" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="users"
              name={UI_MESSAGES.ADMIN_REPORTS_SERIES_USERS}
              stroke={SERIES_COLORS.users}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="foundations"
              name={UI_MESSAGES.ADMIN_REPORTS_SERIES_FOUNDATIONS}
              stroke={SERIES_COLORS.foundations}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="donations"
              name={UI_MESSAGES.ADMIN_REPORTS_SERIES_DONATIONS}
              stroke={SERIES_COLORS.donations}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="campaigns"
              name={UI_MESSAGES.ADMIN_REPORTS_SERIES_CAMPAIGNS}
              stroke={SERIES_COLORS.campaigns}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={UI_MESSAGES.ADMIN_REPORTS_MONTHLY_BARS} empty={!hasMonthlyData}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyActivity} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ebe6f5" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="users"
              name={UI_MESSAGES.ADMIN_REPORTS_SERIES_USERS}
              fill={SERIES_COLORS.users}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="foundations"
              name={UI_MESSAGES.ADMIN_REPORTS_SERIES_FOUNDATIONS}
              fill={SERIES_COLORS.foundations}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="donations"
              name={UI_MESSAGES.ADMIN_REPORTS_SERIES_DONATIONS}
              fill={SERIES_COLORS.donations}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="campaigns"
              name={UI_MESSAGES.ADMIN_REPORTS_SERIES_CAMPAIGNS}
              fill={SERIES_COLORS.campaigns}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
