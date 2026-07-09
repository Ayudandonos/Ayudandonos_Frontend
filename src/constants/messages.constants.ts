/**
 * Textos de interfaz dirigidos al usuario final.
 * Los identificadores estan en ingles; el contenido visible es en espanol.
 */
export const UI_MESSAGES = {
  APP_NAME: 'Ayudándonos',
  APP_TAGLINE: 'Conectando fundaciones con donantes',
  APP_FOOTER: (year: number) => `© ${year} Ayudándonos — Donaciones en especie`,

  NAV_LOGIN: 'Iniciar sesión',
  NAV_REGISTER: 'Registrarse',
  NAV_LOGOUT: 'Cerrar sesión',

  HOME_HERO_TITLE: 'Conecta con quienes',
  HOME_HERO_HIGHLIGHT: 'más lo necesitan',
  HOME_HERO_DESCRIPTION:
    'Ayudándonos conecta fundaciones verificadas con personas que desean donar en especie. Publica necesidades, comprométete y haz seguimiento de cada entrega.',
  HOME_CTA_DONATE: 'Comenzar a donar',
  HOME_CTA_FOUNDATION: 'Soy una fundación',
  HOME_API_CONNECTED: (version: string, environment: string) =>
    `API conectada — v${version} (${environment})`,
  HOME_API_ERROR: 'No se pudo conectar con el servidor',

  LOGIN_TITLE: 'Iniciar sesión',
  LOGIN_SUBTITLE: 'Accede a tu cuenta de Ayudándonos',
  LOGIN_SUBMIT: 'Iniciar sesión',
  LOGIN_PENDING: 'Formulario de login — Fase 2',
  LOGIN_NO_ACCOUNT: '¿No tienes cuenta?',
  LOGIN_REGISTER_LINK: 'Regístrate',

  REGISTER_TITLE: 'Crear cuenta',
  REGISTER_SUBTITLE: 'Únete a la comunidad Ayudándonos',
  REGISTER_SUBMIT: 'Registrarse',
  REGISTER_PENDING: 'Formulario de registro — Fase 2',
  REGISTER_HAS_ACCOUNT: '¿Ya tienes cuenta?',
  REGISTER_LOGIN_LINK: 'Inicia sesión',

  NOT_FOUND_CODE: '404',
  NOT_FOUND_MESSAGE: 'Página no encontrada',
  NOT_FOUND_BACK: 'Volver al inicio',

  LOADING: 'Cargando...',

  AUTH_NOT_IMPLEMENTED: 'Autenticación no implementada — Fase 2',
  AUTH_CONTEXT_ERROR: 'useAuth debe usarse dentro de AuthProvider',

  HOME_FEATURES: [
    {
      title: 'Publicación',
      description: 'Las fundaciones publican campañas y necesidades específicas.',
    },
    {
      title: 'Compromiso',
      description: 'Los donantes se comprometen a realizar entregas en especie.',
    },
    {
      title: 'Seguimiento',
      description: 'Todo el ciclo de vida de la donación queda registrado.',
    },
  ],
} as const;
