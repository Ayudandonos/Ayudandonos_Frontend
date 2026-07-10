export interface Campaign {
  id: string;
  title: string;
  foundationName: string;
  description: string;
  city: string;
  date: string;
  needsCount: number;
  status: 'active' | 'closed';
  imageUrl: string;
}

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    title: 'Campaña Invierno Cálido 2024',
    foundationName: 'Fundación Esperanza',
    description:
      'Ayudamos a familias vulnerables con abrigo y alimentos durante la temporada de frío.',
    city: 'Bogotá',
    date: '15 Oct, 2026',
    needsCount: 12,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=400&fit=crop',
  },
  {
    id: '2',
    title: 'Nutriendo el futuro: Comedor Escolar',
    foundationName: 'Alimentar con Amor',
    description: 'Proveemos alimentos nutritivos para niños en comunidades rurales.',
    city: 'Medellín',
    date: '02 Nov, 2026',
    needsCount: 8,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop',
  },
  {
    id: '3',
    title: 'Digitalización Rural Educativa',
    foundationName: 'Educa Futuro',
    description: 'Equipamos aulas con tecnología para reducir la brecha digital.',
    city: 'Cali',
    date: '18 Oct, 2026',
    needsCount: 5,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop',
  },
];

/**
 * Entrada: Ninguna.
 * Proceso: Retorna campanas mock mientras la API de campanas no esta disponible.
 * Salida: Retorna arreglo de campanas simuladas.
 */
export async function fetchCampaigns(): Promise<Campaign[]> {
  return MOCK_CAMPAIGNS;
}

/**
 * Entrada: id: identificador de la campana buscada.
 * Proceso: Busca la campana mock por id mientras la API no esta conectada.
 * Salida: Retorna la campana encontrada o undefined.
 */
export async function fetchCampaignById(id: string): Promise<Campaign | undefined> {
  return MOCK_CAMPAIGNS.find((c) => c.id === id);
}
