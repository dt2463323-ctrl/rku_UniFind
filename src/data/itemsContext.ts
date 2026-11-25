import { createContext, useContext } from 'react'
import type { Item } from './types'

export interface ItemsStore {
  items: Item[]
  addItem: (item: Item) => void
  updateItem: (id: string, patch: Partial<Item>) => void
  removeItem: (id: string) => void
}

export const ItemsContext = createContext<ItemsStore | null>(null)

export function useItems(): ItemsStore {
  const store = useContext(ItemsContext)
  if (!store) throw new Error('useItems must be used inside ItemsProvider')
  return store
}
