import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { mockUser } from '@/data/mock-data'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, _password: string) => Promise<void>
  signup: (name: string, email: string, _password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email) => {
        await new Promise((r) => setTimeout(r, 700))
        set({ user: { ...mockUser, email: email || mockUser.email }, isAuthenticated: true })
      },
      signup: async (name, email) => {
        await new Promise((r) => setTimeout(r, 700))
        set({ user: { ...mockUser, name: name || mockUser.name, email: email || mockUser.email }, isAuthenticated: true })
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'bugpilot-auth' }
  )
)
