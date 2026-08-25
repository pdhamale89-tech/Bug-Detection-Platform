import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Search, Sun, Moon, BookOpen, Bell, ChevronDown, LogOut, UserCog } from 'lucide-react'
import { useAppStore } from '@/stores/app-store'
import { useThemeStore } from '@/stores/theme-store'
import { useAuthStore } from '@/stores/auth-store'
import { formatRelativeTime, cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export function TopNav() {
  const navigate = useNavigate()
  const setMobileNavOpen = useAppStore((s) => s.setMobileNavOpen)
  const notifications = useAppStore((s) => s.notifications)
  const markAllNotificationsRead = useAppStore((s) => s.markAllNotificationsRead)
  const showToast = useAppStore((s) => s.showToast)
  const unreadCount = notifications.filter((n) => !n.read).length
  const { mode, toggle } = useThemeStore()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [search, setSearch] = useState('')

  return (
    <header className="flex h-16 items-center gap-3 border-b border-border bg-card/60 px-4 backdrop-blur">
      <button
        className="rounded-md p-2 text-muted-foreground hover:bg-accent lg:hidden"
        onClick={() => setMobileNavOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden max-w-sm flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && search.trim()) {
              navigate(`/bugs?q=${encodeURIComponent(search)}`)
            }
          }}
          aria-label="Search projects, bugs, and reports"
          placeholder="Search projects, bugs, and reports..."
          className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
          {mode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden sm:inline-flex"
          onClick={() => showToast({ title: 'Documentation', description: 'Opening BugPilot AI docs in a new tab.', variant: 'default' })}
          aria-label="Documentation"
        >
          <BookOpen className="h-4 w-4" />
        </Button>

        <div className="relative">
          <Button variant="ghost" size="icon" onClick={() => setNotifOpen((v) => !v)} aria-label="Notifications">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </Button>
          {notifOpen && (
            <div className="absolute right-0 top-11 z-50 w-80 rounded-lg border border-border bg-card shadow-lg">
              <div className="flex items-center justify-between border-b border-border p-3">
                <span className="text-sm font-semibold">Notifications</span>
                <button
                  className="text-xs text-primary hover:underline"
                  onClick={() => {
                    markAllNotificationsRead()
                  }}
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      setNotifOpen(false)
                      if (n.link) navigate(n.link)
                    }}
                    className={cn(
                      'flex w-full flex-col gap-0.5 border-b border-border px-3 py-2.5 text-left last:border-0 hover:bg-accent',
                      !n.read && 'bg-primary/5'
                    )}
                  >
                    <span className="text-sm font-medium">{n.title}</span>
                    <span className="text-xs text-muted-foreground">{n.message}</span>
                    <span className="text-[11px] text-muted-foreground">{formatRelativeTime(n.createdAt)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setUserOpen((v) => !v)}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {user?.name?.[0] ?? 'U'}
            </div>
            <span className="hidden text-sm font-medium sm:inline">{user?.name}</span>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:inline" />
          </button>
          {userOpen && (
            <div className="absolute right-0 top-12 z-50 w-56 rounded-lg border border-border bg-card shadow-lg">
              <div className="border-b border-border p-3">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setUserOpen(false)
                  navigate('/settings')
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
              >
                <UserCog className="h-4 w-4" /> Profile & Settings
              </button>
              <button
                onClick={() => {
                  setUserOpen(false)
                  logout()
                  navigate('/login')
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
