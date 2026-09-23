'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Trash2, X, Save, Upload, ImageIcon } from 'lucide-react'

interface Product {
  id: number
  category: string
  name: string
  name_bn: string | null
  image: string | null
  price: number
  original_price: number | null
  unit: string | null
  unit_bn: string | null
  rating: number
  reviews: number
  badge: string | null
  badge_bn: string | null
  tags: string[] | null
  description: string | null
  description_bn: string | null
  delivery: string | null
  delivery_bn: string | null
  in_stock: boolean
}

const emptyForm = {
  category: '',
  name: '',
  name_bn: '',
  image: '',
  price: '',
  original_price: '',
  unit: '',
  unit_bn: '',
  rating: '5',
  reviews: '0',
  badge: '',
  badge_bn: '',
  tags: '',
  description: '',
  description_bn: '',
  delivery: 'Home delivery Available',
  delivery_bn: 'হোম ডেলিভারি উপলব্ধ',
  in_stock: true,
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true })

    if (!error && data) setProducts(data as Product[])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  function openAdd() {
    setEditingId(null)
    setForm({ ...emptyForm })
    setPreview(null)
    setError(null)
    setShowForm(true)
  }

  function openEdit(p: Product) {
    setEditingId(p.id)
    setForm({
      category: p.category || '',
      name: p.name || '',
      name_bn: p.name_bn || '',
      image: p.image || '',
      price: String(p.price ?? ''),
      original_price: p.original_price != null ? String(p.original_price) : '',
      unit: p.unit || '',
      unit_bn: p.unit_bn || '',
      rating: String(p.rating ?? 5),
      reviews: String(p.reviews ?? 0),
      badge: p.badge || '',
      badge_bn: p.badge_bn || '',
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
      description: p.description || '',
      description_bn: p.description_bn || '',
      delivery: p.delivery || '',
      delivery_bn: p.delivery_bn || '',
      in_stock: p.in_stock ?? true,
    })
    setPreview(p.image || null)
    setError(null)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm({ ...emptyForm })
    setPreview(null)
    setError(null)
  }

  function updateField(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Basic validation
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP, etc.)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const ext = file.name.split('.').pop()
      const fileName = `\( {Date.now()}- \){Math.random().toString(36).slice(2)}.${ext}`
      const filePath = `products/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        setError(uploadError.message)
        setUploading(false)
        return
      }

      // Get public URL
      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath)
      const publicUrl = data.publicUrl

      setForm((prev) => ({ ...prev, image: publicUrl }))
      setPreview(publicUrl)
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    }

    setUploading(false)
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.name.trim()) {
      setError('Product name (English) is required')
      return
    }
    if (!form.category.trim()) {
      setError('Category is required')
      return
    }
    if (!form.price || isNaN(Number(form.price))) {
      setError('Valid price is required')
      return
    }

    setSaving(true)

    const payload = {
      category: form.category.trim(),
      name: form.name.trim(),
      name_bn: form.name_bn.trim() || null,
      image: form.image.trim() || null,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      unit: form.unit.trim() || null,
      unit_bn: form.unit_bn.trim() || null,
      rating: Number(form.rating) || 5,
      reviews: Number(form.reviews) || 0,
      badge: form.badge.trim() || null,
      badge_bn: form.badge_bn.trim() || null,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      description: form.description.trim() || null,
      description_bn: form.description_bn.trim() || null,
      delivery: form.delivery.trim() || null,
      delivery_bn: form.delivery_bn.trim() || null,
      in_stock: form.in_stock,
    }

    let result
    if (editingId) {
      result = await supabase.from('products').update(payload).eq('id', editingId)
    } else {
      result = await supabase.from('products').insert([payload])
    }

    setSaving(false)

    if (result.error) {
      setError(result.error.message)
      return
    }

    closeForm()
    load()
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) alert(error.message)
    else load()
  }

  if (loading) return <p className="text-sm text-gray-500">Loading products...</p>

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Products</h2>
          <p className="text-sm text-gray-500">Add, edit or remove shop products</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A5C36] text-white text-sm font-bold hover:bg-[#084c2c] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Product list */}
      <div className="space-y-3 mb-8">
        {products.length === 0 && (
          <p className="text-sm text-gray-500 bg-white rounded-2xl border p-6 text-center">
            No products yet. Click “Add Product” to create one.
          </p>
        )}

        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                  No img
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-gray-900 truncate">{p.name}</p>
              {p.name_bn && <p className="text-xs text-gray-500 truncate">{p.name_bn}</p>}
              <p className="text-xs text-gray-500 mt-0.5">
                {p.category} · ৳ {Number(p.price).toLocaleString('en-IN')}
                {p.unit ? ` / ${p.unit}` : ''}
                {!p.in_stock && (
                  <span className="ml-2 text-red-500 font-bold">Out of stock</span>
                )}
              </p>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => openEdit(p)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id, p.name)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
              <h3 className="font-extrabold text-gray-900 text-lg">
                {editingId ? 'Edit Product' : 'Add Product'}
              </h3>
              <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>
              )}

              {/* Image Upload Section */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">Product Image</label>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Preview */}
                  <div className="w-28 h-28 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-300" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="product-image-upload"
                    />
                    <label
                      htmlFor="product-image-upload"
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-sm font-bold text-gray-600 hover:border-[#0A5C36] hover:text-[#0A5C36] cursor-pointer transition-colors ${
                        uploading ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </label>
                    <p className="text-xs text-gray-400">JPG, PNG, WebP · Max 5MB</p>

                    {/* Optional: keep URL field as fallback */}
                    <input
                      value={form.image}
                      onChange={(e) => {
                        updateField('image', e.target.value)
                        setPreview(e.target.value || null)
                      }}
                      placeholder="Or paste image URL"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#0A5C36] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Name (English) *
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0A5C36] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Name (Bangla)
                  </label>
                  <input
                    value={form.name_bn}
                    onChange={(e) => updateField('name_bn', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0A5C36] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Category *</label>
                  <input
                    value={form.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    placeholder="e.g. Dairy, Organic Produce, Cattle"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0A5C36] focus:outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Price *</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => updateField('price', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0A5C36] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Original Price</label>
                    <input
                      type="number"
                      value={form.original_price}
                      onChange={(e) => updateField('original_price', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0A5C36] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Unit (EN)</label>
                  <input
                    value={form.unit}
                    onChange={(e) => updateField('unit', e.target.value)}
                    placeholder="500g / 1 kg"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0A5C36] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Unit (BN)</label>
                  <input
                    value={form.unit_bn}
                    onChange={(e) => updateField('unit_bn', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0A5C36] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Badge (EN)</label>
                  <input
                    value={form.badge}
                    onChange={(e) => updateField('badge', e.target.value)}
                    placeholder="10% off"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0A5C36] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Badge (BN)</label>
                  <input
                    value={form.badge_bn}
                    onChange={(e) => updateField('badge_bn', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0A5C36] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  value={form.tags}
                  onChange={(e) => updateField('tags', e.target.value)}
                  placeholder="Organic, Farm Fresh, Zero Pesticide"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0A5C36] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Description (EN)</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0A5C36] focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Description (BN)</label>
                  <textarea
                    value={form.description_bn}
                    onChange={(e) => updateField('description_bn', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0A5C36] focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Delivery (EN)</label>
                  <input
                    value={form.delivery}
                    onChange={(e) => updateField('delivery', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0A5C36] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Delivery (BN)</label>
                  <input
                    value={form.delivery_bn}
                    onChange={(e) => updateField('delivery_bn', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0A5C36] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.in_stock}
                    onChange={(e) => updateField('in_stock', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#0A5C36] focus:ring-[#0A5C36]"
                  />
                  <span className="text-sm font-bold text-gray-700">In Stock</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A5C36] text-white text-sm font-bold hover:bg-[#084c2c] disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
