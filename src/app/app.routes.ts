import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        data: { roles: ['admin'] },
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'pos',
        data: { roles: ['admin', 'mozo', 'cajero'] },
        loadComponent: () => import('./features/pos/pos.component').then((m) => m.PosComponent),
      },
      {
        path: 'mesas',
        data: { roles: ['admin', 'mozo', 'cajero'] },
        loadComponent: () => import('./features/mesas/mesas.component').then((m) => m.MesasComponent),
      },
      {
        path: 'pedidos',
        data: { roles: ['admin', 'mozo', 'cocina', 'cajero'] },
        loadComponent: () =>
          import('./features/pedidos/pedidos.component').then((m) => m.PedidosComponent),
      },
      {
        path: 'reservas',
        data: { roles: ['admin', 'mozo', 'cajero'] },
        loadComponent: () =>
          import('./features/reservas/reservas.component').then((m) => m.ReservasComponent),
      },
      {
        path: 'cocina',
        data: { roles: ['admin', 'cocina'] },
        loadComponent: () => import('./features/cocina/cocina.component').then((m) => m.CocinaComponent),
      },
      {
        path: 'productos',
        data: { roles: ['admin'] },
        loadComponent: () =>
          import('./features/productos/productos.component').then((m) => m.ProductosComponent),
      },
      {
        path: 'recetas',
        data: { roles: ['admin'] },
        loadComponent: () => import('./features/recetas/recetas.component').then((m) => m.RecetasComponent),
      },
      {
        path: 'caja',
        data: { roles: ['admin', 'cajero'] },
        loadComponent: () => import('./features/caja/caja.component').then((m) => m.CajaComponent),
      },
      {
        path: 'usuarios',
        data: { roles: ['admin'] },
        loadComponent: () =>
          import('./features/usuarios/usuarios.component').then((m) => m.UsuariosComponent),
      },
      {
        path: 'inventario',
        data: { roles: ['admin'] },
        loadComponent: () =>
          import('./features/inventario/inventario.component').then((m) => m.InventarioComponent),
      },
      {
        path: 'compras',
        data: { roles: ['admin'] },
        loadComponent: () => import('./features/compras/compras.component').then((m) => m.ComprasComponent),
      },
      {
        path: 'clientes',
        data: { roles: ['admin', 'cajero'] },
        loadComponent: () =>
          import('./features/clientes/clientes.component').then((m) => m.ClientesComponent),
      },
      {
        path: 'delivery',
        data: { roles: ['admin', 'cajero', 'mozo'] },
        loadComponent: () =>
          import('./features/delivery/delivery.component').then((m) => m.DeliveryComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
