import { api } from '@/services/api';
import type { ApiSuccessResponse } from '@/types';
import type { City, Country, State } from '@/features/location/types/location.types';

/**
 * Entrada: Ninguna.
 * Proceso: Consulta GET /locations/countries del backend Ayudandonos.
 * Salida: Retorna listado tipado de paises.
 */
export async function fetchCountries(): Promise<Country[]> {
  const { data } = await api.get<ApiSuccessResponse<Country[]>>('/locations/countries');
  return data.data;
}

/**
 * Entrada: countryIso: codigo ISO2 del pais.
 * Proceso: Consulta GET /locations/countries/:countryIso/states.
 * Salida: Retorna listado tipado de estados.
 */
export async function fetchStates(countryIso: string): Promise<State[]> {
  const { data } = await api.get<ApiSuccessResponse<State[]>>(
    `/locations/countries/${countryIso}/states`,
  );
  return data.data;
}

/**
 * Entrada: countryIso: ISO2 pais; stateIso: ISO del estado.
 * Proceso: Consulta GET /locations/countries/:countryIso/states/:stateIso/cities.
 * Salida: Retorna listado tipado de ciudades.
 */
export async function fetchCities(countryIso: string, stateIso: string): Promise<City[]> {
  const { data } = await api.get<ApiSuccessResponse<City[]>>(
    `/locations/countries/${countryIso}/states/${stateIso}/cities`,
  );
  return data.data;
}
