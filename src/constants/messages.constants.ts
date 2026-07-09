/**
 * Textos de interfaz dirigidos al usuario final.
 * Proyecto: Ayudandonos.
 */
export const UI_MESSAGES = {
  APP_NAME: 'Ayudandonos',
  APP_TAGLINE: 'Uniendo voluntades para el cambio',
  APP_FOOTER: (year: number) =>
    `© ${year} Ayudandonos. Todos los derechos reservados.`,

  NAV_HOME: 'Inicio',
  NAV_ORGANIZATIONS: 'Organizaciones',
  NAV_IMPACT: 'Impacto',
  NAV_LOGIN: 'Iniciar sesión',
  NAV_REGISTER: 'Registrarse',
  NAV_LOGOUT: 'Cerrar sesión',

  NAV_CAMPAIGNS: 'Campañas',
  NAV_MY_COMMITMENTS: 'Mis Compromisos',
  NAV_FOUNDATIONS: 'Fundaciones',
  NAV_PROFILE: 'Perfil',
  NAV_NEW_DONATION: 'Nueva Donación',
  NAV_SETTINGS: 'Configuración',
  NAV_CREATE_CAMPAIGN: 'Crear Campaña',
  NAV_NEEDS: 'Necesidades',
  NAV_REQUESTS: 'Solicitudes',
  NAV_DELIVERIES: 'Entregas',

  CAMPAIGNS_TITLE: 'Campañas',
  CAMPAIGNS_DESCRIPTION:
    'Explora campañas activas de fundaciones verificadas y encuentra cómo ayudar.',
  CAMPAIGNS_SEARCH_PLACEHOLDER: 'Buscar por nombre o palabra clave...',
  CAMPAIGNS_FILTER_CITY: 'Ciudad',
  CAMPAIGNS_FILTER_CATEGORY: 'Categoría',
  CAMPAIGNS_FILTER_STATUS: 'Estado',
  CAMPAIGNS_FILTER_ALL: 'Todas',
  CAMPAIGNS_FILTER_ACTIVE: 'Activas',
  CAMPAIGNS_VIEW: 'Ver campaña',
  CAMPAIGNS_STATUS_ACTIVE: 'Activa',
  CAMPAIGNS_NEEDS_COUNT: (count: number) => `${count} necesidades publicadas`,
  CAMPAIGNS_CTA_TITLE: '¿Tienes una iniciativa?',
  CAMPAIGNS_CTA_DESC:
    'Publica una campaña y conecta con donantes que quieren ayudar en especie.',
  CAMPAIGNS_CTA_ACTION: 'Empezar ahora',

  GLOBAL_SEARCH_PLACEHOLDER: 'Buscar en la plataforma...',

  FOOTER_SECURE: 'Plataforma Segura y Verificada',
  FOOTER_TERMS: 'Términos y Condiciones',
  FOOTER_PRIVACY: 'Privacidad',
  FOOTER_HELP: 'Ayuda',

  LEGAL_BACK: 'Volver al inicio',
  LEGAL_LAST_UPDATED: 'Última actualización: 9 de julio de 2026',

  LEGAL_SECURE_TITLE: 'Plataforma Segura y Verificada',
  LEGAL_SECURE_SUBTITLE:
    'Ayudandonos implementa controles técnicos y operativos para proteger a donantes, fundaciones y la trazabilidad de las donaciones en especie.',
  LEGAL_SECURE_SECTIONS: [
    {
      title: 'Verificación de fundaciones',
      paragraphs: [
        'Toda organización que solicita acceso como fundación pasa por un proceso de revisión documental antes de publicar campañas o recibir donaciones.',
        'Validamos identidad institucional, datos de contacto y coherencia de la información declarada para reducir riesgos de fraude o suplantación.',
      ],
    },
    {
      title: 'Protección de datos y acceso',
      paragraphs: [
        'Las credenciales se almacenan con cifrado y el acceso a la plataforma se realiza mediante tokens de sesión con expiración controlada.',
        'Aplicamos buenas prácticas de seguridad en transporte (HTTPS), autenticación y limitación de intentos de acceso no autorizados.',
      ],
    },
    {
      title: 'Trazabilidad de donaciones',
      paragraphs: [
        'Cada aporte queda registrado con estados claros: compromiso, entrega, confirmación y cierre, lo que permite auditar el ciclo completo.',
        'Donantes y fundaciones pueden consultar el historial de sus interacciones dentro de la plataforma según su rol.',
      ],
    },
    {
      title: 'Compromiso de mejora continua',
      paragraphs: [
        'Revisamos periódicamente nuestras políticas de seguridad y actualizamos la plataforma para responder a nuevos riesgos y requisitos normativos.',
        'Si detectas una actividad sospechosa, repórtala a través del Centro de Ayuda para que nuestro equipo pueda investigarla.',
      ],
    },
  ],

  LEGAL_TERMS_TITLE: 'Términos y Condiciones',
  LEGAL_TERMS_SUBTITLE:
    'Al utilizar Ayudandonos aceptas las condiciones descritas a continuación. Te recomendamos leerlas antes de registrarte o realizar donaciones.',
  LEGAL_TERMS_SECTIONS: [
    {
      title: '1. Objeto del servicio',
      paragraphs: [
        'Ayudandonos es una plataforma digital que conecta personas donantes con fundaciones verificadas para gestionar donaciones en especie de forma transparente.',
        'El servicio incluye publicación de campañas, registro de necesidades, compromisos de aporte y seguimiento del ciclo de entrega.',
      ],
    },
    {
      title: '2. Registro y cuentas',
      paragraphs: [
        'Debes proporcionar información veraz y mantenerla actualizada. Eres responsable de la confidencialidad de tu contraseña y de toda actividad en tu cuenta.',
        'Ayudandonos puede suspender o cancelar cuentas que incumplan estos términos, proporcionen datos falsos o utilicen la plataforma con fines ilícitos.',
      ],
    },
    {
      title: '3. Uso permitido',
      paragraphs: [
        'Los donantes pueden explorar campañas, comprometerse a aportes y registrar entregas conforme a las reglas de cada iniciativa.',
        'Las fundaciones deben publicar necesidades reales, responder solicitudes de forma diligente y confirmar recepciones de manera oportuna.',
      ],
    },
    {
      title: '4. Limitación de responsabilidad',
      paragraphs: [
        'Ayudandonos facilita la coordinación entre partes, pero no sustituye acuerdos directos ni garantiza la disponibilidad ininterrumpida del servicio.',
        'No nos hacemos responsables por retrasos logísticos, daños en bienes donados o incumplimientos atribuibles a terceros fuera de nuestro control razonable.',
      ],
    },
    {
      title: '5. Modificaciones',
      paragraphs: [
        'Podemos actualizar estos términos para reflejar cambios legales o funcionales. Publicaremos la versión vigente en esta página.',
        'El uso continuado de la plataforma después de un cambio implica la aceptación de los términos actualizados.',
      ],
    },
  ],

  LEGAL_PRIVACY_TITLE: 'Política de Privacidad',
  LEGAL_PRIVACY_SUBTITLE:
    'Esta política describe qué datos recopilamos, cómo los utilizamos y cuáles son tus derechos como usuario de Ayudandonos.',
  LEGAL_PRIVACY_SECTIONS: [
    {
      title: 'Datos que recopilamos',
      paragraphs: [
        'Recopilamos datos de identificación (nombre, correo electrónico), información de perfil y, cuando aplica, datos de la fundación asociada.',
        'También registramos actividad relacionada con campañas, donaciones, entregas y eventos de seguridad necesarios para operar el servicio.',
      ],
    },
    {
      title: 'Finalidad del tratamiento',
      paragraphs: [
        'Utilizamos tus datos para autenticarte, gestionar tu cuenta, facilitar donaciones y mejorar la experiencia de uso de la plataforma.',
        'Podemos enviarte comunicaciones operativas sobre el estado de tus aportes, solicitudes o verificaciones pendientes.',
      ],
    },
    {
      title: 'Conservación y seguridad',
      paragraphs: [
        'Conservamos la información el tiempo necesario para cumplir fines legales, contractuales y de trazabilidad de las donaciones.',
        'Aplicamos medidas técnicas y organizativas para proteger los datos contra acceso no autorizado, pérdida o alteración.',
      ],
    },
    {
      title: 'Tus derechos',
      paragraphs: [
        'Puedes solicitar acceso, rectificación o eliminación de tus datos personales, así como oponerte a ciertos tratamientos cuando la normativa lo permita.',
        'Para ejercer tus derechos, contacta a nuestro equipo a través del Centro de Ayuda indicando el correo asociado a tu cuenta.',
      ],
    },
    {
      title: 'Cookies y tecnologías similares',
      paragraphs: [
        'Utilizamos almacenamiento local y cookies estrictamente necesarias para mantener la sesión y preferencias básicas de la aplicación.',
        'No vendemos tu información personal a terceros con fines comerciales.',
      ],
    },
  ],

  LEGAL_HELP_TITLE: 'Centro de Ayuda',
  LEGAL_HELP_SUBTITLE:
    'Encuentra respuestas a las consultas más frecuentes sobre registro, donaciones y uso de Ayudandonos.',
  LEGAL_HELP_SECTIONS: [
    {
      title: 'Primeros pasos',
      paragraphs: [
        'Si eres donante, crea una cuenta, explora campañas activas y comprométete con las necesidades que puedas cubrir.',
        'Si representas una fundación, regístrate con el perfil correspondiente y completa la verificación antes de publicar campañas.',
      ],
    },
    {
      title: 'Soporte',
      paragraphs: [
        'Nuestro equipo revisa solicitudes de ayuda en días hábiles. Incluye en tu mensaje el correo de tu cuenta y una descripción clara del problema.',
        'Para incidencias de seguridad o accesos no autorizados, indícalo como prioridad alta en tu consulta.',
      ],
    },
  ],
  LEGAL_HELP_FAQ_TITLE: 'Preguntas frecuentes',
  LEGAL_HELP_FAQ: [
    {
      question: '¿Cómo creo una cuenta?',
      answer:
        'Desde la pantalla de registro elige si eres donante o fundación, completa el formulario y acepta los términos y la política de privacidad.',
    },
    {
      question: '¿Cómo funciona una donación en especie?',
      answer:
        'Selecciona una campaña, revisa las necesidades publicadas, comprométete con un aporte y sigue el flujo de entrega hasta la confirmación por la fundación.',
    },
    {
      question: '¿Qué hago si olvidé mi contraseña?',
      answer:
        'La recuperación automática estará disponible próximamente. Mientras tanto, contacta a soporte desde esta página con tu correo registrado.',
    },
    {
      question: '¿Cómo se verifica una fundación?',
      answer:
        'Validamos documentación institucional y coherencia de la información antes de habilitar funciones de publicación y recepción de aportes.',
    },
  ],
  LEGAL_HELP_CONTACT_TITLE: '¿Necesitas más ayuda?',
  LEGAL_HELP_CONTACT_BODY:
    'Escríbenos a soporte@conectaayuda.org con el asunto de tu consulta. Responderemos a la brevedad posible en horario laboral.',

  ORGANIZATIONS_TITLE: 'Organizaciones que transforman vidas',
  ORGANIZATIONS_SUBTITLE:
    'Ayudandonos verifica fundaciones y ONG para que donantes confíen en cada campaña y cada entrega quede registrada.',
  ORGANIZATIONS_SECTIONS: [
    {
      title: 'Verificación institucional',
      items: [
        'Revisión de documentación legal y datos de contacto.',
        'Validación de coherencia entre misión declarada y necesidades publicadas.',
        'Monitoreo continuo de actividad en la plataforma.',
      ],
    },
    {
      title: 'Gestión de campañas',
      items: [
        'Publicación de necesidades específicas por campaña.',
        'Recepción y revisión de solicitudes de ayuda.',
        'Programación y confirmación de entregas en especie.',
      ],
    },
    {
      title: 'Transparencia',
      items: [
        'Historial auditable de aportes y estados de entrega.',
        'Comunicación clara con donantes en cada etapa.',
        'Reportes de impacto para la comunidad.',
      ],
    },
  ],
  ORGANIZATIONS_CTA_TITLE: '¿Tu organización necesita apoyo?',
  ORGANIZATIONS_CTA_BODY:
    'Regístrate como fundación, completa la verificación y comienza a publicar campañas para recibir donaciones en especie.',
  ORGANIZATIONS_CTA_BUTTON: 'Registrar mi fundación',

  IMPACT_TITLE: 'Impacto que se puede medir',
  IMPACT_SUBTITLE:
    'Cada donación en Ayudandonos deja un registro. Creemos en la transparencia como base de la confianza entre donantes y organizaciones.',
  IMPACT_STATS: [
    { value: '+120', label: 'Organizaciones verificadas' },
    { value: '+850', label: 'Donantes activos' },
    { value: '+2.400', label: 'Aportes registrados' },
    { value: '94%', label: 'Entregas confirmadas' },
  ],
  IMPACT_SECTIONS: [
    {
      title: 'Trazabilidad completa',
      body: 'Desde el compromiso del donante hasta la confirmación de recepción, cada paso queda documentado para garantizar visibilidad y responsabilidad.',
    },
    {
      title: 'Comunidades beneficiadas',
      body: 'Las campañas conectan recursos con necesidades reales: alimentos, insumos, ropa y materiales que llegan directamente a quienes más lo necesitan.',
    },
    {
      title: 'Compromiso con la mejora',
      body: 'Actualizamos indicadores, procesos y herramientas para que el impacto social sea cada vez más claro, medible y verificable.',
    },
  ],
  IMPACT_CTA: 'Quiero generar impacto',

  HOME_HERO_TITLE: 'Conecta con quienes',
  HOME_HERO_HIGHLIGHT: 'más lo necesitan',
  HOME_HERO_DESCRIPTION:
    'Ayudandonos conecta fundaciones verificadas con personas que desean donar en especie. Publica necesidades, comprométete y haz seguimiento de cada entrega.',
  HOME_CTA_CARD_TITLE: 'Empieza hoy',
  HOME_CTA_CARD_SUBTITLE: 'Regístrate como donante o fundación y forma parte de la red.',
  HOME_CTA_DONATE: 'Comenzar a donar',
  HOME_CTA_FOUNDATION: 'Soy una fundación',
  HOME_HAS_ACCOUNT: '¿Ya tienes cuenta?',
  HOME_FEATURES_TITLE: '¿Cómo funciona Ayudandonos?',
  HOME_API_CONNECTED: (version: string, environment: string) =>
    `API conectada — v${version} (${environment})`,
  HOME_API_ERROR: 'No se pudo conectar con el servidor',

  LOGIN_HERO_TITLE_1: 'Conectando personas que ayudan con organizaciones que',
  LOGIN_HERO_HIGHLIGHT: 'transforman vidas.',
  LOGIN_HERO_DESCRIPTION:
    'Únete a la red logística más transparente y eficiente para la gestión de donaciones en especie.',
  LOGIN_TITLE: 'Iniciar Sesión',
  LOGIN_SUBTITLE: 'Ingresa tus credenciales para acceder al panel.',
  LOGIN_EMAIL_LABEL: 'Correo Electrónico',
  LOGIN_EMAIL_PLACEHOLDER: 'nombre@ejemplo.com',
  LOGIN_PASSWORD_LABEL: 'Contraseña',
  LOGIN_PASSWORD_PLACEHOLDER: '••••••••',
  LOGIN_FORGOT_PASSWORD: '¿Olvidaste tu contraseña?',
  LOGIN_FORGOT_PASSWORD_ARIA: 'Recuperación de contraseña no disponible aún',
  LOGIN_SHOW_PASSWORD: 'Mostrar contraseña',
  LOGIN_HIDE_PASSWORD: 'Ocultar contraseña',
  LOGIN_PASSWORD_TOGGLE_SHOW: 'Mostrar',
  LOGIN_PASSWORD_TOGGLE_HIDE: 'Ocultar',
  LOGIN_REMEMBER: 'Recordar mi sesión',
  LOGIN_SUBMIT: 'Iniciar sesión',
  LOGIN_DIVIDER: 'O CONTINÚA CON',
  LOGIN_GOOGLE: 'Google',
  LOGIN_SSO: 'SSO',
  LOGIN_GOOGLE_ARIA: 'Continuar con Google',
  LOGIN_SSO_ARIA: 'Continuar con SSO',
  LOGIN_NO_ACCOUNT: '¿No tienes una cuenta?',
  LOGIN_REGISTER_LINK: 'Crear cuenta',

  REGISTER_TITLE: 'Crea tu cuenta',
  REGISTER_SUBTITLE_1: 'Únete a nuestra comunidad y comienza a generar un',
  REGISTER_SUBTITLE_2: 'impacto positivo hoy mismo.',
  REGISTER_PROFILE_LABEL: 'SELECCIONA TU PERFIL',
  REGISTER_BACK_ARIA: 'Volver al inicio de sesión',
  REGISTER_DONOR_ARIA: 'Seleccionar perfil donante',
  REGISTER_FOUNDATION_ARIA: 'Seleccionar perfil fundación',
  REGISTER_DONOR_TITLE: 'Soy Donante',
  REGISTER_DONOR_DESC_1: 'Persona individual con ganas',
  REGISTER_DONOR_DESC_2: 'de ayudar.',
  REGISTER_FOUNDATION_TITLE: 'Soy Fundación',
  REGISTER_FOUNDATION_DESC_1: 'Organización buscando apoyo',
  REGISTER_FOUNDATION_DESC_2: 'y recursos.',
  REGISTER_FULL_NAME: 'Nombre completo',
  REGISTER_FULL_NAME_PLACEHOLDER: 'Ej: Juan Pérez',
  REGISTER_EMAIL: 'Correo electrónico',
  REGISTER_EMAIL_PLACEHOLDER: 'hola@ejemplo.com',
  REGISTER_PHONE: 'Teléfono de contacto',
  REGISTER_PHONE_PLACEHOLDER: '+34 000 000 000',
  REGISTER_PASSWORD: 'Contraseña',
  REGISTER_CONFIRM_PASSWORD: 'Confirmar contraseña',
  REGISTER_FOUNDATION_NAME: 'Nombre de la fundación',
  REGISTER_FOUNDATION_NAME_PLACEHOLDER: 'Ej: Fundación Esperanza',
  REGISTER_FOUNDATION_DESCRIPTION: 'Descripción de la fundación',
  REGISTER_FOUNDATION_DESCRIPTION_PLACEHOLDER: 'Breve descripción de tu organización',
  REGISTER_TERMS_PREFIX: 'Acepto los',
  REGISTER_TERMS_LINK: 'términos y condiciones',
  REGISTER_TERMS_AND: 'y la',
  REGISTER_PRIVACY_LINK: 'política de privacidad',
  REGISTER_SUBMIT: 'Registrarse',
  REGISTER_HAS_ACCOUNT: '¿Ya tienes una cuenta?',
  REGISTER_LOGIN_LINK: 'Iniciar sesión',

  NOT_FOUND_CODE: '404',
  NOT_FOUND_MESSAGE: 'Página no encontrada',
  NOT_FOUND_BACK: 'Volver al inicio',

  LOADING: 'Cargando...',
  AUTH_CONTEXT_ERROR: 'useAuth debe usarse dentro de AuthProvider',
  AUTH_INVALID_CREDENTIALS: 'Credenciales inválidas',
  AUTH_ACCOUNT_DISABLED: 'Tu cuenta está desactivada',
  AUTH_EMAIL_EXISTS: 'Este correo ya está registrado',
  AUTH_GENERIC_ERROR: 'Ocurrió un error. Intenta de nuevo.',
  AUTH_TERMS_REQUIRED: 'Debes aceptar los términos y condiciones',

  VALIDATION_EMAIL: 'Correo electrónico inválido',
  VALIDATION_PASSWORD_MIN: 'La contraseña debe tener al menos 8 caracteres',
  VALIDATION_PASSWORD_UPPERCASE: 'Debe incluir al menos una mayúscula',
  VALIDATION_PASSWORD_NUMBER: 'Debe incluir al menos un número',
  VALIDATION_FULL_NAME: 'El nombre debe tener al menos 2 caracteres',
  VALIDATION_FOUNDATION_NAME: 'El nombre de la fundación debe tener al menos 2 caracteres',
  VALIDATION_PASSWORD_MATCH: 'Las contraseñas no coinciden',

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
