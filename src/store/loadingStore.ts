import { type StateCreator, create } from 'zustand'

export interface StoreLoadingType {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void

  messageLoading: string
  setMessageLoading: (messageLoading: string) => void
}
const storeLoading: StateCreator<StoreLoadingType> = (set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => { set({ isLoading }) },

  messageLoading: '',
  setMessageLoading: (messageLoading) => { set({ messageLoading }) },
})

export const useLoadingStore = create<StoreLoadingType>()(
  storeLoading,
)
