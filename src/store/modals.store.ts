import { type StateCreator, create } from 'zustand'

export interface IModalStore {
  isShow: boolean
  setIsShow: (isShow: boolean) => void

  messageModal: string
  setMessageModal: (messageModal: string) => void
}
const modalStore: StateCreator<IModalStore> = (set) => ({
  isShow: false,
  setIsShow: (isShow) => { set({ isShow }) },

  messageModal: '',
  setMessageModal: (messageModal) => { set({ messageModal }) },
})

export const useModalStore = create<IModalStore>()(
  modalStore,
)
