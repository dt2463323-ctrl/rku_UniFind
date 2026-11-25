import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { items as sampleItems } from './items'
import { ItemsContext } from './itemsContext'
import type { Item } from './types'

// In-memory store: changes live until the page reloads.
export function ItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>(sampleItems)
  const addItem = useCallback((item: Item) => setItems((prev) => [item, ...prev]), [])
  const updateItem = useCallback(
    (id: string, patch: Partial<Item>) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i))),
    [],
  )
  const removeItem = useCallback((id: string) => setItems((prev) => prev.filter((i) => i.id !== id)), [])
  const value = useMemo(() => ({ items, addItem, updateItem, removeItem }), [items, addItem, updateItem, removeItem])
  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
}
