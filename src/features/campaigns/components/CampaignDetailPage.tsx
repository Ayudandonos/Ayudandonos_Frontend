import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UI_MESSAGES } from '@/constants/messages.constants';
import {
  fetchCampaignById,
  type Campaign,
} from '@/features/campaigns/services/campaigns.service';

// Entrada:
// Ninguna (id desde useParams).

// Proceso:
// Renderiza detalle de campana con datos mock.

// Salida:
// Retorna el elemento JSX del detalle de campana.
export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    if (id) void fetchCampaignById(id).then((c) => setCampaign(c ?? null));
  }, [id]);

  if (!campaign) {
    return <p className="text-text-secondary">{UI_MESSAGES.LOADING}</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <img src={campaign.imageUrl} alt="" className="h-64 w-full rounded-xl object-cover" />
      <div className="rounded-xl border border-border-default bg-white p-6">
        <span className="rounded-full bg-status-active px-3 py-1 text-xs font-semibold text-white">
          {UI_MESSAGES.CAMPAIGNS_STATUS_ACTIVE}
        </span>
        <h1 className="mt-4 text-3xl font-bold">{campaign.title}</h1>
        <p className="mt-1 text-vivid-700">{campaign.foundationName}</p>
        <p className="mt-4 text-text-secondary">{campaign.description}</p>
        <p className="mt-4 text-sm text-text-muted">
          {campaign.city} · {campaign.date}
        </p>
        <Link
          to={`/campaigns/${campaign.id}/contribute`}
          className="mt-6 inline-block rounded-xl bg-vivid-700 px-6 py-3 text-sm font-medium text-white"
        >
          Confirmar aporte
        </Link>
      </div>
    </div>
  );
}
