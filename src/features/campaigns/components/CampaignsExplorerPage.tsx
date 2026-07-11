import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { fetchCampaigns, type Campaign } from '@/features/campaigns/services/campaigns.service';

/**
 * Entrada: Ninguna.
 * Proceso: Renderiza explorador de campanas segun Figma con datos mock.
 * Salida: Retorna el elemento JSX de la pagina de campanas.
 */
export function CampaignsExplorerPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    void fetchCampaigns().then(setCampaigns);
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">{UI_MESSAGES.CAMPAIGNS_TITLE}</h1>
        <p className="mt-2 max-w-3xl text-text-secondary">{UI_MESSAGES.CAMPAIGNS_DESCRIPTION}</p>
      </header>
      <div className="rounded-xl border border-border-default bg-white p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <input
            placeholder={UI_MESSAGES.CAMPAIGNS_SEARCH_PLACEHOLDER}
            className="rounded-lg border border-border-default bg-vivid-50 px-4 py-2 text-sm md:col-span-2"
            readOnly
          />
          <select className="rounded-lg border border-border-default bg-white px-4 py-2 text-sm">
            <option>{UI_MESSAGES.CAMPAIGNS_FILTER_ALL}</option>
          </select>
          <select className="rounded-lg border border-border-default bg-white px-4 py-2 text-sm">
            <option>{UI_MESSAGES.CAMPAIGNS_FILTER_ACTIVE}</option>
          </select>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {campaigns.map((campaign) => (
          <article
            key={campaign.id}
            className="overflow-hidden rounded-xl border border-border-default bg-white shadow-sm"
          >
            <div className="relative h-44">
              <img src={campaign.imageUrl} alt="" className="h-full w-full object-cover" />
              <span className="absolute right-3 top-3 rounded-full bg-status-active px-3 py-1 text-xs font-semibold text-white">
                {UI_MESSAGES.CAMPAIGNS_STATUS_ACTIVE}
              </span>
            </div>
            <div className="space-y-3 p-5">
              <h2 className="text-lg font-bold text-text-primary">{campaign.title}</h2>
              <p className="text-sm font-medium text-vivid-700">{campaign.foundationName}</p>
              <p className="line-clamp-2 text-sm text-text-secondary">{campaign.description}</p>
              <p className="text-xs text-text-muted">
                {campaign.city} · {campaign.date}
              </p>
              <p className="text-sm text-vivid-700">
                {UI_MESSAGES.CAMPAIGNS_NEEDS_COUNT(campaign.needsCount)}
              </p>
              <Link
                to={`/campaigns/${campaign.id}`}
                className="block rounded-xl bg-vivid-700 py-3 text-center text-sm font-medium text-white"
              >
                {UI_MESSAGES.CAMPAIGNS_VIEW}
              </Link>
            </div>
          </article>
        ))}
        <div className="flex flex-col justify-center rounded-xl bg-vivid-700 p-8 text-white">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl">
            +
          </div>
          <h3 className="text-xl font-bold">{UI_MESSAGES.CAMPAIGNS_CTA_TITLE}</h3>
          <p className="mt-2 text-sm text-white/90">{UI_MESSAGES.CAMPAIGNS_CTA_DESC}</p>
          <Link to="/register" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
            {UI_MESSAGES.CAMPAIGNS_CTA_ACTION} →
          </Link>
        </div>
      </div>
    </div>
  );
}
