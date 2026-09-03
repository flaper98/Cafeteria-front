import { Component, computed, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InsumoReceta, Producto } from '../../core/models';
import { ProductosService } from '../../core/services/productos.service';
import { RecetasService } from '../../core/services/recetas.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-recetas',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSnackBarModule, PageHeaderComponent, EmptyStateComponent],
  templateUrl: './recetas.component.html',
  styleUrl: './recetas.component.scss',
})
export class RecetasComponent {
  busqueda = signal('');
  productoSeleccionadoId = signal<string | null>(null);

  productosFiltrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    return this.productosService
      .productos()
      .filter((p) => !texto || p.nombre.toLowerCase().includes(texto));
  });

  productoSeleccionado = computed<Producto | undefined>(() => {
    const id = this.productoSeleccionadoId();
    return id ? this.productosService.getById(id) : undefined;
  });

  recetaActual = computed(() => {
    const id = this.productoSeleccionadoId();
    return id ? this.recetasService.recetas().find((r) => r.productoId === id) : undefined;
  });

  tieneReceta(productoId: string) {
    return this.recetasService.recetas().some((r) => r.productoId === productoId);
  }

  insumos = signal<InsumoReceta[]>([]);
  rendimiento = signal(1);
  notas = signal('');

  costoTotal = computed(() => this.insumos().reduce((acc, i) => acc + i.cantidad * i.costoUnitario, 0));
  costoPorPorcion = computed(() => (this.rendimiento() > 0 ? this.costoTotal() / this.rendimiento() : this.costoTotal()));
  margenSoles = computed(() => (this.productoSeleccionado()?.precio ?? 0) - this.costoPorPorcion());
  margenPorcentaje = computed(() => {
    const precio = this.productoSeleccionado()?.precio ?? 0;
    return precio > 0 ? (this.margenSoles() / precio) * 100 : 0;
  });

  formInsumo = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    cantidad: [0, [Validators.required, Validators.min(0.01)]],
    unidad: ['g', Validators.required],
    costoUnitario: [0, [Validators.required, Validators.min(0)]],
  });

  constructor(
    private productosService: ProductosService,
    private recetasService: RecetasService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {}

  seleccionarProducto(producto: Producto) {
    this.productoSeleccionadoId.set(producto.id);
    const receta = this.recetasService.recetas().find((r) => r.productoId === producto.id);
    this.insumos.set(receta ? [...receta.insumos] : []);
    this.rendimiento.set(receta?.rendimiento ?? 1);
    this.notas.set(receta?.notas ?? '');
  }

  agregarInsumo() {
    if (this.formInsumo.invalid) return;
    const valor = this.formInsumo.getRawValue();
    this.insumos.update((lista) => [
      ...lista,
      { id: `tmp-${Date.now()}-${lista.length}`, ...valor },
    ]);
    this.formInsumo.reset({ nombre: '', cantidad: 0, unidad: valor.unidad, costoUnitario: 0 });
  }

  quitarInsumo(id: string) {
    this.insumos.update((lista) => lista.filter((i) => i.id !== id));
  }

  guardarReceta() {
    const producto = this.productoSeleccionado();
    if (!producto) return;
    this.recetasService.guardar(producto.id, this.insumos(), this.rendimiento(), this.notas());
    this.snackBar.open('Receta guardada', 'Cerrar', { duration: 2000 });
  }
}
