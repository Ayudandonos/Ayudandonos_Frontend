import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let defaultIconsConfigured = false;

/**
 * Entrada: Ninguna.
 * Proceso: Corrige rutas de iconos por defecto de Leaflet rotas con el bundler de Vite.
 * Salida: No retorna valor; configura Icon.Default una sola vez.
 */
export function setupLeafletDefaultIcons(): void {
  if (defaultIconsConfigured) {
    return;
  }

  // Leaflet asume rutas absolutas que Vite no sirve; se sobrescriben con assets importados.
  delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });

  defaultIconsConfigured = true;
}

/**
 * Entrada: Ninguna.
 * Proceso: Crea un DivIcon azul para marcar la ubicacion del usuario.
 * Salida: Retorna el icono Leaflet reutilizable.
 */
export function createUserLocationIcon(): L.DivIcon {
  return L.divIcon({
    className: 'ayudandonos-user-marker',
    html: '<span class="ayudandonos-user-marker__dot" aria-hidden="true"></span>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}
