import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  PlayCircle,
  Bug,
  ListChecks,
  Sparkles,
  FileBarChart,
  Plug,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  BugPlay,
} from 'lucide-react'
import { useAppStore } from '@/stores/app-store'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/test-runs', label: 'Test Runs', icon: PlayCircle },
  { to: '/bugs', label: 'Bugs', icon: Bug },
  { to: '/test-runs/run_01', label: 'Test Cases', icon: ListChecks },
  { to: '/projects/new', label: 'AI Agent', icon: Sparkles },
  { to: '/reports/run_01', label: 'Reports', icon: FileBarChart },
  { to: '/settings', label: 'Integrations', icon: Plug },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ mobile, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const collapsed = useAppStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-border bg-card transition-all duration-200',
        mobile ? 'w-64' : collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <BugPlay className="h-5 w-5" />
        </div>
        {(mobile || !collapsed) && <span className="text-lg font-bold tracking-tight">BugPilot</span>}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {(mobile || !collapsed) && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {!mobile && (
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-2 border-t border-border px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      )}
    </aside>
  )
}
