import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Save, Package, DollarSign, Layers, Hash, AlertTriangle, Image as ImageIcon } from 'lucide-react'

const CATEGORIES = ['Hair Care', 'Styling', 'Beard & Shave', 'Hair Color', 'Treatment', 'Accessories', 'General']

const InventoryModal = ({ isOpen, onClose, onSave, editingItem = null }) => {
    const isEdit = Boolean(editingItem)

    const [formData, setFormData] = useState(() => ({
        name: editingItem?.name || '',
        category: editingItem?.category || 'Hair Care',
        sku: editingItem?.sku || '',
        stock: editingItem ? (editingItem.stock ?? 0) : 25,
        max: editingItem ? (editingItem.max ?? 100) : 100,
        threshold: editingItem ? (editingItem.threshold ?? 15) : 15,
        price: editingItem ? (editingItem.price ?? '0.00') : '20.00',
        image: editingItem?.image || ''
    }))

    const [error, setError] = useState('')

    if (!isOpen) return null

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            setError('Product name is required')
            return
        }

        const stockNum = parseInt(formData.stock, 10)
        const maxNum = parseInt(formData.max, 10)
        const thresholdNum = parseInt(formData.threshold, 10)
        const priceNum = parseFloat(formData.price)

        if (isNaN(stockNum) || stockNum < 0) {
            setError('Stock must be a non-negative number')
            return
        }

        if (isNaN(maxNum) || maxNum <= 0) {
            setError('Max capacity must be greater than 0')
            return
        }

        if (stockNum > maxNum) {
            setError('Current stock cannot exceed maximum capacity')
            return
        }

        if (isNaN(thresholdNum) || thresholdNum < 0) {
            setError('Low stock threshold must be a non-negative number')
            return
        }

        if (isNaN(priceNum) || priceNum < 0) {
            setError('Price must be a valid positive amount')
            return
        }

        const payload = {
            name: formData.name.trim(),
            category: formData.category,
            sku: formData.sku.trim().toUpperCase(),
            stock: stockNum,
            max: maxNum,
            threshold: thresholdNum,
            price: priceNum,
            image: formData.image.trim() || `https://placehold.co/100x100/222/FFF?text=${formData.name.trim()[0]?.toUpperCase() || 'P'}`
        }

        onSave(payload)
        onClose()
    }

    return createPortal(
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-obsidian-surface border border-white/10 w-full max-w-lg max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-white/5 bg-obsidian-elevated/60">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-champagne/10 rounded-lg text-champagne">
                            <Package size={20} />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-white">
                                {isEdit ? 'Edit Inventory Item' : 'Add New Inventory Item'}
                            </h2>
                            <p className="text-xs text-[#777]">
                                {isEdit ? 'Update stock quantity, thresholds and details' : 'Enter product details to add to salon stock'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
                    {error && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs sm:text-sm rounded-lg flex items-center gap-2">
                            <AlertTriangle size={16} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Product Name */}
                    <div>
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1.5">
                            Product Name <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Keratin Repair Serum"
                                className="w-full bg-obsidian-elevated border border-[#333] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Category & SKU */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1.5">
                                Category
                            </label>
                            <div className="relative">
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-obsidian-elevated border border-[#333] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition-all cursor-pointer"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat} className="bg-obsidian-elevated text-white">
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1.5">
                                SKU / Code
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    <Hash size={14} />
                                </span>
                                <input
                                    type="text"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    placeholder="e.g. ELG-KRT-01"
                                    className="w-full bg-obsidian-elevated border border-[#333] rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition-all uppercase"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stock, Max Capacity, Threshold */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1.5">
                                Current Stock
                            </label>
                            <input
                                type="number"
                                name="stock"
                                min="0"
                                value={formData.stock}
                                onChange={handleChange}
                                className="w-full bg-obsidian-elevated border border-[#333] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1.5">
                                Max Capacity
                            </label>
                            <input
                                type="number"
                                name="max"
                                min="1"
                                value={formData.max}
                                onChange={handleChange}
                                className="w-full bg-obsidian-elevated border border-[#333] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1.5" title="Alert triggered when stock falls below this">
                                Alert Threshold
                            </label>
                            <input
                                type="number"
                                name="threshold"
                                min="0"
                                value={formData.threshold}
                                onChange={handleChange}
                                className="w-full bg-obsidian-elevated border border-[#333] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Price and Image URL */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1.5">
                                Unit Price ($)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    <DollarSign size={14} />
                                </span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="25.00"
                                    className="w-full bg-obsidian-elevated border border-[#333] rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1.5">
                                Image URL (Optional)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    <ImageIcon size={14} />
                                </span>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full bg-obsidian-elevated border border-[#333] rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition-all text-xs"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white bg-transparent border border-[#333] hover:border-gray-500 rounded-xl transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 text-sm font-bold text-black bg-champagne hover:bg-champagne-dark rounded-xl shadow-lg hover:shadow-champagne/20 transition-all flex items-center gap-2 cursor-pointer"
                        >
                            <Save size={16} />
                            <span>{isEdit ? 'Save Changes' : 'Add Product'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    )
}

export default InventoryModal
