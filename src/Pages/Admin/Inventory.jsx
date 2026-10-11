import { useState, useMemo } from 'react'
import {
    Search,
    Plus,
    Filter,
    Package,
    AlertTriangle,
    AlertCircle,
    CheckCircle2,
    DollarSign,
    Edit2,
    Trash2,
    PlusCircle,
    MinusCircle,
    RotateCcw,
    Layers,
    ArrowUpDown
} from 'lucide-react'
import { useInventory } from '../../Context/InventoryContext'
import { useMessage } from '../../Context/MessageContext'
import InventoryModal from '../../Components/AdminPanel Components/InventoryModal'
import ConfirmModal from '../../Components/ConfirmModal'
import StatsCard from '../../Components/AdminPanel Components/StatsCard'

const CATEGORIES = ['All', 'Hair Care', 'Styling', 'Beard & Shave', 'Hair Color', 'Treatment', 'Accessories']

function Inventory() {
    const { items, addItem, updateItem, deleteItem, adjustStock, resetToDefaults, stats } = useInventory()
    const { showMessage } = useMessage()

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [statusFilter, setStatusFilter] = useState('All') // 'All', 'In Stock', 'Low Stock', 'Out of Stock'
    const [sortBy, setSortBy] = useState('name-asc') // 'name-asc', 'name-desc', 'stock-asc', 'stock-desc', 'price-desc'

    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [confirmReset, setConfirmReset] = useState(false)

    // Filter and Sort items
    const filteredItems = useMemo(() => {
        return items
            .filter(item => {
                const matchesSearch =
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()))

                const matchesCategory =
                    selectedCategory === 'All' || item.category === selectedCategory

                let matchesStatus = true
                if (statusFilter === 'Out of Stock') {
                    matchesStatus = item.stock === 0
                } else if (statusFilter === 'Low Stock') {
                    matchesStatus = item.stock > 0 && item.stock <= item.threshold
                } else if (statusFilter === 'In Stock') {
                    matchesStatus = item.stock > item.threshold
                }

                return matchesSearch && matchesCategory && matchesStatus
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'name-asc':
                        return a.name.localeCompare(b.name)
                    case 'name-desc':
                        return b.name.localeCompare(a.name)
                    case 'stock-asc':
                        return a.stock - b.stock
                    case 'stock-desc':
                        return b.stock - a.stock
                    case 'price-asc':
                        return a.price - b.price
                    case 'price-desc':
                        return b.price - a.price
                    default:
                        return 0
                }
            })
    }, [items, searchTerm, selectedCategory, statusFilter, sortBy])

    const handleOpenAdd = () => {
        setEditingItem(null)
        setIsModalOpen(true)
    }

    const handleOpenEdit = (item) => {
        setEditingItem(item)
        setIsModalOpen(true)
    }

    const handleSave = (itemData) => {
        if (editingItem) {
            const res = updateItem(editingItem.id, itemData)
            if (res.success) {
                showMessage('success', `Product "${itemData.name}" updated successfully`)
            } else {
                showMessage('error', res.error || 'Failed to update product')
            }
        } else {
            const res = addItem(itemData)
            if (res.success) {
                showMessage('success', `Product "${itemData.name}" added to inventory`)
            } else {
                showMessage('error', res.error || 'Failed to add product')
            }
        }
    }

    const handleDeleteConfirm = () => {
        if (confirmDelete) {
            const res = deleteItem(confirmDelete.id)
            if (res.success) {
                showMessage('success', `Removed "${confirmDelete.name}" from inventory`)
            } else {
                showMessage('error', 'Failed to delete product')
            }
            setConfirmDelete(null)
        }
    }

    const handleResetConfirm = () => {
        resetToDefaults()
        showMessage('success', 'Inventory catalog reset to default items')
        setConfirmReset(false)
    }

    const handleAdjust = (id, amount, itemName) => {
        const res = adjustStock(id, amount)
        if (res.success) {
            const sign = amount > 0 ? `+${amount}` : `${amount}`
            showMessage('info', `${itemName} stock updated (${sign})`)
        }
    }

    const getStockStatus = (item) => {
        if (item.stock === 0) {
            return {
                label: 'Out of Stock',
                color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
                barColor: 'bg-rose-500'
            }
        }
        if (item.stock <= item.threshold) {
            return {
                label: 'Low Stock',
                color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                barColor: 'bg-amber-500'
            }
        }
        return {
            label: 'In Stock',
            color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
            barColor: 'bg-emerald-500'
        }
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-obsidian-surface/60 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/5">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white flex items-center gap-2">
                        <Package className="text-champagne" size={24} />
                        Inventory <span className="text-champagne">Management</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-[#777] mt-1">
                        Monitor salon stock levels, adjust units, and prevent product shortages
                    </p>
                </div>
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <button
                        onClick={() => setConfirmReset(true)}
                        className="p-2 sm:px-3 sm:py-2 text-[#777] hover:text-white hover:bg-white/5 border border-white/10 rounded-xl transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        title="Reset Catalog to Defaults"
                    >
                        <RotateCcw size={14} />
                        <span className="hidden sm:inline">Reset Defaults</span>
                    </button>
                    <button
                        onClick={handleOpenAdd}
                        className="flex-1 sm:flex-initial px-4 py-2.5 bg-champagne hover:bg-champagne-dark text-black font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg hover:shadow-champagne/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Plus size={16} />
                        <span>Add Product</span>
                    </button>
                </div>
            </div>

            {/* Stats Overview Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                <StatsCard
                    title="Total Products"
                    value={stats.totalProducts}
                    change={`${stats.totalUnits} Total Units`}
                    positive={true}
                    icon={<Package size={22} />}
                    color="text-champagne"
                    bg="bg-champagne/10"
                />
                <StatsCard
                    title="Low Stock Alerts"
                    value={stats.lowStockOnlyCount}
                    change={stats.lowStockOnlyCount > 0 ? "Requires re-order" : "Stock healthy"}
                    positive={stats.lowStockOnlyCount === 0}
                    icon={<AlertTriangle size={22} />}
                    color={stats.lowStockOnlyCount > 0 ? "text-amber-500" : "text-emerald-500"}
                    bg={stats.lowStockOnlyCount > 0 ? "bg-amber-500/10" : "bg-emerald-500/10"}
                />
                <StatsCard
                    title="Out of Stock"
                    value={stats.outOfStockCount}
                    change={stats.outOfStockCount > 0 ? "Critical attention" : "Zero depleted"}
                    positive={stats.outOfStockCount === 0}
                    icon={<AlertCircle size={22} />}
                    color={stats.outOfStockCount > 0 ? "text-rose-500" : "text-emerald-500"}
                    bg={stats.outOfStockCount > 0 ? "bg-rose-500/10" : "bg-emerald-500/10"}
                />
                <StatsCard
                    title="Total Stock Value"
                    value={`$${stats.totalValuation.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                    change="Estimated retail value"
                    positive={true}
                    icon={<DollarSign size={22} />}
                    color="text-emerald-500"
                    bg="bg-emerald-500/10"
                />
            </div>

            {/* Controls Filter Bar */}
            <div className="bg-obsidian-surface/60 backdrop-blur-md border border-white/5 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-col lg:flex-row gap-3 justify-between items-stretch lg:items-center">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search by product name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-obsidian-elevated border border-[#333] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-champagne transition-all"
                        />
                    </div>

                    {/* Status Filter buttons */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide text-xs font-semibold">
                        {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all cursor-pointer ${statusFilter === status
                                    ? 'bg-champagne/15 text-champagne border-champagne/40'
                                    : 'bg-obsidian-elevated/80 text-gray-400 border-transparent hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Sorting Dropdown */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 hidden sm:inline flex items-center gap-1">
                            <ArrowUpDown size={12} /> Sort:
                        </span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-obsidian-elevated border border-[#333] text-gray-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-champagne cursor-pointer"
                        >
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value="stock-asc">Stock (Lowest First)</option>
                            <option value="stock-desc">Stock (Highest First)</option>
                            <option value="price-desc">Price (High to Low)</option>
                            <option value="price-asc">Price (Low to High)</option>
                        </select>
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-white/5 scrollbar-hide">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                        <Layers size={13} /> Category:
                    </span>
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${selectedCategory === category
                                ? 'bg-champagne text-black font-bold'
                                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Inventory Table / Cards */}
            <div className="bg-obsidian-surface/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                {filteredItems.length === 0 ? (
                    <div className="p-12 text-center space-y-3">
                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mx-auto text-gray-500">
                            <Package size={28} />
                        </div>
                        <h3 className="text-white font-bold text-base">No inventory items found</h3>
                        <p className="text-xs text-gray-500 max-w-sm mx-auto">
                            No products match your current search or filter criteria. Try clearing filters or add a new item.
                        </p>
                        {(searchTerm || selectedCategory !== 'All' || statusFilter !== 'All') && (
                            <button
                                onClick={() => {
                                    setSearchTerm('')
                                    setSelectedCategory('All')
                                    setStatusFilter('All')
                                }}
                                className="mt-2 text-xs font-bold text-champagne hover:underline cursor-pointer"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-obsidian-elevated/40 text-[11px] uppercase tracking-wider font-bold text-gray-400">
                                    <th className="py-3.5 px-4 sm:px-6">Product & SKU</th>
                                    <th className="py-3.5 px-4">Category</th>
                                    <th className="py-3.5 px-4">Unit Price</th>
                                    <th className="py-3.5 px-4 min-w-[180px]">Stock Level</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4 text-center">Quick Adjust</th>
                                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {filteredItems.map(item => {
                                    const statusInfo = getStockStatus(item)
                                    const percentage = Math.min(100, Math.round((item.stock / item.max) * 100))

                                    return (
                                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                                            {/* Product name & thumbnail */}
                                            <td className="py-4 px-4 sm:px-6">
                                                <div className="flex items-center gap-3.5">
                                                    <div className="w-11 h-11 rounded-xl bg-obsidian-elevated border border-white/10 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover rounded-lg"
                                                            onError={(e) => {
                                                                e.target.onerror = null
                                                                e.target.src = `https://placehold.co/100x100/222/FFF?text=${item.name[0]}`
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-semibold group-hover:text-champagne transition-colors">
                                                            {item.name}
                                                        </div>
                                                        <div className="text-[11px] text-gray-500 font-mono tracking-wide">
                                                            {item.sku || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="py-4 px-4">
                                                <span className="text-xs text-gray-300 bg-white/5 border border-white/5 px-2.5 py-1 rounded-md">
                                                    {item.category}
                                                </span>
                                            </td>

                                            {/* Price */}
                                            <td className="py-4 px-4 font-semibold text-gray-200">
                                                ${Number(item.price).toFixed(2)}
                                            </td>

                                            {/* Stock progress */}
                                            <td className="py-4 px-4">
                                                <div>
                                                    <div className="flex justify-between items-center text-xs mb-1.5">
                                                        <span className="font-bold text-white">
                                                            {item.stock} <span className="text-gray-500 font-normal">/ {item.max}</span>
                                                        </span>
                                                        <span className="text-[11px] text-gray-400">
                                                            {percentage}%
                                                        </span>
                                                    </div>
                                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${statusInfo.barColor} transition-all duration-500`}
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-4 px-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                                                    {item.stock === 0 ? (
                                                        <AlertCircle size={12} />
                                                    ) : item.stock <= item.threshold ? (
                                                        <AlertTriangle size={12} />
                                                    ) : (
                                                        <CheckCircle2 size={12} />
                                                    )}
                                                    {statusInfo.label}
                                                </span>
                                            </td>

                                            {/* Quick Stock Step buttons */}
                                            <td className="py-4 px-4 text-center">
                                                <div className="inline-flex items-center gap-1 bg-obsidian-elevated border border-white/10 rounded-xl p-1">
                                                    <button
                                                        onClick={() => handleAdjust(item.id, -1, item.name)}
                                                        disabled={item.stock <= 0}
                                                        className="p-1 hover:text-white text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                                                        title="Decrease stock by 1"
                                                    >
                                                        <MinusCircle size={16} />
                                                    </button>
                                                    <span className="text-xs font-mono font-bold px-2 text-white min-w-[28px] text-center">
                                                        {item.stock}
                                                    </span>
                                                    <button
                                                        onClick={() => handleAdjust(item.id, 1, item.name)}
                                                        disabled={item.stock >= item.max}
                                                        className="p-1 hover:text-white text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                                                        title="Increase stock by 1"
                                                    >
                                                        <PlusCircle size={16} />
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Row Actions */}
                                            <td className="py-4 px-4 sm:px-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => handleOpenEdit(item)}
                                                        className="p-2 text-gray-400 hover:text-champagne hover:bg-champagne/10 rounded-lg transition-all cursor-pointer"
                                                        title="Edit Product"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDelete(item)}
                                                        className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                                                        title="Delete Product"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Inventory Add/Edit Modal */}
            {isModalOpen && (
                <InventoryModal
                    key={editingItem ? `edit-${editingItem.id}` : 'add-new'}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    editingItem={editingItem}
                />
            )}

            {/* Delete Confirmation Modal */}
            {confirmDelete && (
                <ConfirmModal
                    message={`Are you sure you want to delete "${confirmDelete.name}" from inventory? This action cannot be undone.`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}

            {/* Reset Confirmation Modal */}
            {confirmReset && (
                <ConfirmModal
                    message="Are you sure you want to restore the default inventory catalog? Current stock modifications will be reset."
                    onConfirm={handleResetConfirm}
                    onCancel={() => setConfirmReset(false)}
                />
            )}
        </div>
    )
}

export default Inventory
