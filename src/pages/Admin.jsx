import React, { useState } from 'react';
import { useProducts } from '@/lib/useProducts';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Plus, Pencil, Trash2, Save, X, PackageX, Package,
  Flame, Leaf, AlertTriangle, Loader2
} from 'lucide-react';

const EMPTY_FORM = {
  name: '', subtitle: '', description: '',
  category: 'clasicas', basePrice: '',
  spicy: false, vegetarian: false, stock: '',
  image: '',
  sizes: [
    { name: 'Pequeña', inches: '10"', price: '' },
    { name: 'Mediana', inches: '12"', price: '' },
    { name: 'Grande',  inches: '14"', price: '' },
  ],
};

export default function Admin() {
  const { user } = useAuth();
  const { products, loading, updateProduct, addProduct, deleteProduct } = useProducts();
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [stockEdit, setStockEdit] = useState({});

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // --- Stock rápido ---
  const handleStockChange = (id, val) => {
    setStockEdit(prev => ({ ...prev, [id]: val }));
  };
  const saveStock = async (id) => {
    const val = parseInt(stockEdit[id]);
    if (isNaN(val) || val < 0) return;
    setSaving(true);
    await updateProduct(id, { stock: val });
    setStockEdit(prev => { const n = {...prev}; delete n[id]; return n; });
    setSaving(false);
  };

  // --- Formulario producto ---
  const openNew = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };
  const openEdit = (p) => {
    setForm({
      name: p.name, subtitle: p.subtitle || '', description: p.description || '',
      category: p.category || 'clasicas', basePrice: p.basePrice || '',
      spicy: p.spicy || false, vegetarian: p.vegetarian || false,
      stock: p.stock ?? '', image: p.image || '',
      sizes: p.sizes ? [...p.sizes.map(s => ({...s}))] : EMPTY_FORM.sizes,
    });
    setEditingId(p.id);
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const handleFormChange = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const handleSizeChange = (idx, field, val) => {
    setForm(f => {
      const sizes = [...f.sizes];
      sizes[idx] = { ...sizes[idx], [field]: val };
      return { ...f, sizes };
    });
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const data = {
      ...form,
      basePrice: Number(form.basePrice) || 0,
      stock: Number(form.stock) || 0,
      sizes: form.sizes.map(s => ({ ...s, price: Number(s.price) || 0 })),
      ingredients: form.description.split(',').map(s => s.trim()).filter(Boolean),
    };
    if (editingId) {
      await updateProduct(editingId, data);
    } else {
      await addProduct({ ...data, id: form.name.toLowerCase().replace(/\s+/g, '-') });
    }
    setSaving(false);
    closeForm();
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    await deleteProduct(id);
  };

  const stockColor = (stock) => {
    if (stock === 0) return 'text-red-500';
    if (stock <= 10) return 'text-orange-500';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <div>
            <h1 className="text-3xl font-bold font-display">Panel de Administración</h1>
            <p className="text-muted-foreground text-sm mt-1">Hola, {user?.email}</p>
          </div>
          <Button onClick={openNew} size="lg" className="gap-2 text-base px-6 py-3">
            <Plus className="w-5 h-5" /> Agregar nuevo producto
          </Button>
        </div>

        {/* Alerta sin stock */}
        {products.some(p => p.stock === 0) && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">
              {products.filter(p => p.stock === 0).map(p => p.name).join(', ')} — sin stock
            </span>
          </div>
        )}

        {/* Buscador */}
        <Input
          placeholder="Buscar producto..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-6 max-w-sm"
        />

        {/* Tabla */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Producto</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Categoría</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Precio base</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Stock</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.image && (
                          <img src={p.image} alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        )}
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.subtitle}</p>
                          <div className="flex gap-1 mt-0.5">
                            {p.spicy && <Flame className="w-3 h-3 text-orange-500" />}
                            {p.vegetarian && <Leaf className="w-3 h-3 text-green-500" />}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize text-muted-foreground">{p.category}</td>
                    <td className="px-4 py-3 font-medium">${p.basePrice?.toLocaleString('es-AR')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {p.stock === 0
                          ? <PackageX className="w-4 h-4 text-red-500" />
                          : <Package className={`w-4 h-4 ${stockColor(p.stock)}`} />
                        }
                        <input
                          type="number"
                          min="0"
                          value={stockEdit[p.id] !== undefined ? stockEdit[p.id] : p.stock}
                          onChange={e => handleStockChange(p.id, e.target.value)}
                          className={`w-16 text-center border rounded-md px-2 py-1 text-sm font-semibold
                            focus:outline-none focus:ring-2 focus:ring-primary
                            ${stockColor(p.stock)}`}
                        />
                        {stockEdit[p.id] !== undefined && (
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0"
                            onClick={() => saveStock(p.id)} disabled={saving}>
                            <Save className="w-3.5 h-3.5 text-green-600" />
                          </Button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0"
                          onClick={() => openEdit(p)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(p.id, p.name)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">No hay productos</div>
            )}
          </div>
        )}
      </div>

      {/* Modal formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg my-8 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-display">
                {editingId ? 'Editar producto' : 'Nuevo producto'}
              </h2>
              <Button variant="ghost" size="sm" onClick={closeForm} className="h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <Label>Nombre *</Label>
                <Input value={form.name} onChange={e => handleFormChange('name', e.target.value)} placeholder="Ej: Margherita" />
              </div>
              <div className="space-y-1">
                <Label>Subtítulo</Label>
                <Input value={form.subtitle} onChange={e => handleFormChange('subtitle', e.target.value)} placeholder="La Clásica" />
              </div>
              <div className="space-y-1">
                <Label>Categoría</Label>
                <select
                  value={form.category}
                  onChange={e => handleFormChange('category', e.target.value)}
                  className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
                >
                  <option value="clasicas">Clásicas</option>
                  <option value="especiales">Especiales</option>
                </select>
              </div>
              <div className="col-span-2 space-y-1">
                <Label>Descripción</Label>
                <Input value={form.description} onChange={e => handleFormChange('description', e.target.value)} placeholder="Ingredientes separados por coma..." />
              </div>
              <div className="space-y-1">
                <Label>Precio base ($)</Label>
                <Input type="number" value={form.basePrice} onChange={e => handleFormChange('basePrice', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Stock inicial</Label>
                <Input type="number" value={form.stock} onChange={e => handleFormChange('stock', e.target.value)} />
              </div>
              <div className="col-span-2 space-y-1">
                <Label>URL imagen</Label>
                <Input value={form.image} onChange={e => handleFormChange('image', e.target.value)} placeholder="https://..." />
              </div>
            </div>

            {/* Tamaños */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Precios por tamaño</Label>
              {form.sizes.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground w-20">{s.name} {s.inches}</span>
                  <Input
                    type="number"
                    placeholder="Precio"
                    value={s.price}
                    onChange={e => handleSizeChange(i, 'price', e.target.value)}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>

            {/* Flags */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.spicy} onChange={e => handleFormChange('spicy', e.target.checked)} className="rounded" />
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm">Picante</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.vegetarian} onChange={e => handleFormChange('vegetarian', e.target.checked)} className="rounded" />
                <Leaf className="w-4 h-4 text-green-500" />
                <span className="text-sm">Vegetariana</span>
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving || !form.name.trim()} className="flex-1 gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingId ? 'Guardar cambios' : 'Crear producto'}
              </Button>
              <Button variant="outline" onClick={closeForm}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
