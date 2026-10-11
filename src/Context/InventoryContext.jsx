/* eslint-disable react-refresh/only-export-components */
import { useState, createContext, useContext, useEffect, useMemo } from 'react'

const InventoryContext = createContext()

const STORAGE_KEY = 'EleganceInventory'

const defaultInventory = [
    {
        id: 1,
        name: 'Premium Shampoo',
        category: 'Hair Care',
        stock: 85,
        max: 100,
        threshold: 20,
        price: 28.00,
        sku: 'ELG-SHMP-01',
        image: 'https://placehold.co/100x100/222/FFF?text=S'
    },
    {
        id: 2,
        name: 'Matte Wax',
        category: 'Styling',
        stock: 35,
        max: 100,
        threshold: 25,
        price: 22.00,
        sku: 'ELG-WAX-02',
        image: 'https://placehold.co/100x100/222/FFF?text=W'
    },
    {
        id: 3,
        name: 'Beard Oil',
        category: 'Beard & Shave',
        stock: 12,
        max: 100,
        threshold: 20,
        price: 18.00,
        sku: 'ELG-BORD-03',
        image: 'https://placehold.co/100x100/222/FFF?text=O'
    },
    {
        id: 4,
        name: 'Hair Color Dye',
        category: 'Hair Color',
        stock: 5,
        max: 100,
        threshold: 15,
        price: 34.00,
        sku: 'ELG-DYE-04',
        image: 'https://placehold.co/100x100/222/FFF?text=D'
    },
    {
        id: 5,
        name: 'Argan Oil Serum',
        category: 'Treatment',
        stock: 42,
        max: 80,
        threshold: 15,
        price: 38.00,
        sku: 'ELG-ARGN-05',
        image: 'https://placehold.co/100x100/222/FFF?text=A'
    },
    {
        id: 6,
        name: 'Scalp Treatment Cream',
        category: 'Treatment',
        stock: 8,
        max: 50,
        threshold: 12,
        price: 45.00,
        sku: 'ELG-TRT-06',
        image: 'https://placehold.co/100x100/222/FFF?text=T'
    },
    {
        id: 7,
        name: 'Shaving Foam Deluxe',
        category: 'Beard & Shave',
        stock: 19,
        max: 100,
        threshold: 25,
        price: 16.00,
        sku: 'ELG-SHAV-07',
        image: 'https://placehold.co/100x100/222/FFF?text=F'
    },
    {
        id: 8,
        name: 'Styling Clay',
        category: 'Styling',
        stock: 0,
        max: 60,
        threshold: 15,
        price: 24.00,
        sku: 'ELG-CLAY-08',
        image: 'https://placehold.co/100x100/222/FFF?text=C'
    }
]

export function InventoryProvider({ children }) {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    // Load initial data
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) {
                const parsed = JSON.parse(raw)
                setItems(Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultInventory)
                if (!Array.isArray(parsed) || parsed.length === 0) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultInventory))
                }
            } else {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultInventory))
                setItems(defaultInventory)
            }
        } catch {
            setItems(defaultInventory)
        } finally {
            setLoading(false)
        }
    }, [])

    const persistItems = (newItems) => {
        setItems(newItems)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems))
    }

    const addItem = (productData) => {
        try {
            const nextId = items.length > 0 ? Math.max(...items.map(i => Number(i.id) || 0)) + 1 : 1
            const newItem = {
                id: nextId,
                name: productData.name.trim(),
                category: productData.category?.trim() || 'General',
                stock: Math.max(0, parseInt(productData.stock, 10) || 0),
                max: Math.max(1, parseInt(productData.max, 10) || 100),
                threshold: Math.max(1, parseInt(productData.threshold, 10) || 15),
                price: parseFloat(productData.price) || 0,
                sku: (productData.sku || `ELG-PRD-${String(nextId).padStart(2, '0')}`).trim().toUpperCase(),
                image: productData.image?.trim() || `https://placehold.co/100x100/222/FFF?text=${productData.name?.[0]?.toUpperCase() || 'P'}`
            }

            const updated = [newItem, ...items]
            persistItems(updated)
            return { success: true, item: newItem }
        } catch (err) {
            return { success: false, error: err.message }
        }
    }

    const updateItem = (id, productData) => {
        try {
            const index = items.findIndex(i => i.id === id)
            if (index === -1) return { success: false, error: 'Product not found' }

            const updatedItem = {
                ...items[index],
                ...productData,
                name: productData.name ? productData.name.trim() : items[index].name,
                stock: productData.stock !== undefined ? Math.max(0, parseInt(productData.stock, 10) || 0) : items[index].stock,
                max: productData.max !== undefined ? Math.max(1, parseInt(productData.max, 10) || 100) : items[index].max,
                threshold: productData.threshold !== undefined ? Math.max(1, parseInt(productData.threshold, 10) || 15) : items[index].threshold,
                price: productData.price !== undefined ? parseFloat(productData.price) || 0 : items[index].price
            }

            const updated = [...items]
            updated[index] = updatedItem
            persistItems(updated)
            return { success: true, item: updatedItem }
        } catch (err) {
            return { success: false, error: err.message }
        }
    }

    const deleteItem = (id) => {
        try {
            const updated = items.filter(i => i.id !== id)
            persistItems(updated)
            return { success: true }
        } catch (err) {
            return { success: false, error: err.message }
        }
    }

    const adjustStock = (id, changeAmount) => {
        try {
            const index = items.findIndex(i => i.id === id)
            if (index === -1) return { success: false, error: 'Product not found' }

            const current = items[index]
            const newStock = Math.max(0, Math.min(current.max, current.stock + changeAmount))

            const updatedItem = { ...current, stock: newStock }
            const updated = [...items]
            updated[index] = updatedItem
            persistItems(updated)
            return { success: true, item: updatedItem }
        } catch (err) {
            return { success: false, error: err.message }
        }
    }

    const resetToDefaults = () => {
        persistItems(defaultInventory)
        return { success: true }
    }

    // Calculated stats
    const stats = useMemo(() => {
        const totalProducts = items.length
        const totalUnits = items.reduce((acc, i) => acc + (Number(i.stock) || 0), 0)
        const lowStockItems = items.filter(i => i.stock > 0 && i.stock <= i.threshold)
        const outOfStockItems = items.filter(i => i.stock === 0)
        const lowStockCount = lowStockItems.length + outOfStockItems.length
        const totalValuation = items.reduce((acc, i) => acc + (Number(i.stock) || 0) * (Number(i.price) || 0), 0)

        return {
            totalProducts,
            totalUnits,
            lowStockCount,
            lowStockOnlyCount: lowStockItems.length,
            outOfStockCount: outOfStockItems.length,
            totalValuation
        }
    }, [items])

    const value = {
        items,
        loading,
        addItem,
        updateItem,
        deleteItem,
        adjustStock,
        resetToDefaults,
        stats
    }

    return (
        <InventoryContext.Provider value={value}>
            {children}
        </InventoryContext.Provider>
    )
}

export function useInventory() {
    const context = useContext(InventoryContext)
    if (!context) {
        throw new Error('useInventory must be used within an InventoryProvider')
    }
    return context
}

