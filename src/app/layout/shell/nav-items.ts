import { Rol } from '../../core/models';

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles: Rol[];
}

export interface NavSection {
  titulo: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    titulo: 'Dirección',
    items: [{ label: 'Dashboard y Reportes', path: '/dashboard', icon: 'bar_chart', roles: ['admin'] }],
  },
  {
    titulo: 'Salón y atención al cliente',
    items: [
      { label: 'Punto de Venta', path: '/pos', icon: 'point_of_sale', roles: ['admin', 'mozo', 'cajero'] },
      { label: 'Gestión de Mesas', path: '/mesas', icon: 'table_restaurant', roles: ['admin', 'mozo', 'cajero'] },
      { label: 'Pedidos y Comandas', path: '/pedidos', icon: 'receipt_long', roles: ['admin', 'mozo', 'cocina', 'cajero'] },
      { label: 'Reservas', path: '/reservas', icon: 'event_available', roles: ['admin', 'mozo', 'cajero'] },
    ],
  },
  {
    titulo: 'Cocina y producción',
    items: [
      { label: 'Cocina / KDS', path: '/cocina', icon: 'soup_kitchen', roles: ['admin', 'cocina'] },
      { label: 'Productos y Carta', path: '/productos', icon: 'restaurant_menu', roles: ['admin'] },
      { label: 'Recetas y Costos', path: '/recetas', icon: 'receipt', roles: ['admin'] },
    ],
  },
  {
    titulo: 'Caja y administración',
    items: [
      { label: 'Caja', path: '/caja', icon: 'account_balance_wallet', roles: ['admin', 'cajero'] },
      { label: 'Usuarios y Seguridad', path: '/usuarios', icon: 'admin_panel_settings', roles: ['admin'] },
    ],
  },
  {
    titulo: 'Abastecimiento y almacén',
    items: [
      { label: 'Inventario', path: '/inventario', icon: 'inventory_2', roles: ['admin'] },
      { label: 'Compras y Proveedores', path: '/compras', icon: 'local_shipping', roles: ['admin'] },
    ],
  },
  {
    titulo: 'Clientes y canales de venta',
    items: [
      { label: 'Clientes', path: '/clientes', icon: 'groups', roles: ['admin', 'cajero'] },
      { label: 'Delivery', path: '/delivery', icon: 'delivery_dining', roles: ['admin', 'cajero', 'mozo'] },
    ],
  },
];

export function rutaInicialPara(rol: Rol): string {
  switch (rol) {
    case 'admin':
      return '/dashboard';
    case 'cajero':
      return '/caja';
    case 'cocina':
      return '/cocina';
    case 'mozo':
    default:
      return '/mesas';
  }
}
