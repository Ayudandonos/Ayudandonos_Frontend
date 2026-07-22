import threeSixtyDegrees from '@/assets/icons/360-degrees.svg?raw';
import threeDPrinter from '@/assets/icons/3d-printer.svg?raw';
import threeDPrintingPen from '@/assets/icons/3d-printing-pen.svg?raw';
import notFound from '@/assets/icons/404.svg?raw';
import add from '@/assets/icons/add.svg?raw';
import addFolder from '@/assets/icons/add-folder.svg?raw';
import addressBook from '@/assets/icons/address-book.svg?raw';
import addressCard from '@/assets/icons/address-card.svg?raw';
import ageRestrictionEighteen from '@/assets/icons/age-restriction-eighteen.svg?raw';
import appsAdd from '@/assets/icons/apps-add.svg?raw';
import bell from '@/assets/icons/bell.svg?raw';
import browsers from '@/assets/icons/browsers.svg?raw';
import envelope from '@/assets/icons/envelope.svg?raw';
import eye from '@/assets/icons/eye.svg?raw';
import eyeCrossed from '@/assets/icons/eye-crossed.svg?raw';
import home from '@/assets/icons/home.svg?raw';
import info from '@/assets/icons/info.svg?raw';
import menuBurger from '@/assets/icons/menu-burger.svg?raw';
import search from '@/assets/icons/search.svg?raw';
import telegram from '@/assets/icons/telegram.svg?raw';
import trash from '@/assets/icons/trash.svg?raw';
import usersAlt from '@/assets/icons/users-alt.svg?raw';
import windowAlt from '@/assets/icons/window-alt.svg?raw';

/**
 * Registro centralizado de iconos SVG del proyecto.
 * Fuente oficial: carpeta local ICONOS SVG (copiados a src/assets/icons/).
 * Agregar icono: copiar SVG + registrar aqui.
 */
const BASE_ICONS = {
  '360-degrees': threeSixtyDegrees,
  '3d-printer': threeDPrinter,
  '3d-printing-pen': threeDPrintingPen,
  '404': notFound,
  add,
  'add-folder': addFolder,
  'address-book': addressBook,
  'address-card': addressCard,
  'age-restriction-eighteen': ageRestrictionEighteen,
  'apps-add': appsAdd,
  bell,
  browsers,
  envelope,
  eye,
  'eye-crossed': eyeCrossed,
  home,
  info,
  'menu-burger': menuBurger,
  search,
  telegram,
  trash,
  'users-alt': usersAlt,
  'window-alt': windowAlt,
} as const;

/** Alias semanticos que apuntan a SVG existentes en la carpeta oficial. */
const ICON_ALIASES = {
  user: BASE_ICONS['users-alt'],
  menu: BASE_ICONS['menu-burger'],
  organization: BASE_ICONS['window-alt'],
  building: BASE_ICONS['window-alt'],
  notification: BASE_ICONS.bell,
  phone: BASE_ICONS['address-book'],
  'id-badge': BASE_ICONS['address-card'],
} as const;

export const ICONS = {
  ...BASE_ICONS,
  ...ICON_ALIASES,
} as const;

export type BaseIconName = keyof typeof BASE_ICONS;
