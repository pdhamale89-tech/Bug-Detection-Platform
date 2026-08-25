import { useState } from 'react'
import { Github, Slack, Trello, Sun, Moon, Laptop } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/auth-store'
import { useThemeStore, type ThemeMode } from '@/stores/theme-store'
import { useAppStore } from '@/stores/app-store'
import { cn } from '@/lib/utils'

const integrations = [
  { name: 'GitHub', icon: Github, description: 'Automatically create issues for confirmed bugs.', connected: true },
  { name: 'Jira', icon: Trello, description: 'Sync bug reports into your Jira backlog.', connected: false },
  { name: 'Slack', icon: Slack, description: 'Get notified in a channel when critical bugs are found.', connected: false },
]

const notificationTypes = [
  { key: 'bugFound', label: 'New bug detected', description: 'Notify me when the agent confirms a new bug.' },
  { key: 'testComplete', label: 'Test run completed', description: 'Notify me when a test run finishes.' },
  { key: 'weeklyReport', label: 'Weekly health report', description: 'Send a weekly summary of workspace health.' },
]

export function SettingsPage() {
  const user = useAuthStore((s) => s.user)
  const { mode, setMode } = useThemeStore()
  const showToast = useAppStore((s) => s.showToast)

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [connections, setConnections] = useState<Record<string, boolean>>({ GitHub: true, Jira: false, Slack: false })
  const [notifs, setNotifs] = useState<Record<string, boolean>>({ bugFound: true, testComplete: true, weeklyReport: false })

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile, appearance, and integrations.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
              {name?.[0] ?? 'U'}
            </div>
            <div>
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Full name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <Button onClick={() => showToast({ title: 'Profile updated', variant: 'success' })}>Save</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose how BugPilot AI looks on your device.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {(
              [
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'system', label: 'System', icon: Laptop },
              ] as { value: ThemeMode; label: string; icon: typeof Sun }[]
            ).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setMode(opt.value)}
                className={cn(
                  'flex flex-1 flex-col items-center gap-2 rounded-md border p-4 text-sm font-medium transition-colors',
                  mode === opt.value ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'
                )}
              >
                <opt.icon className="h-5 w-5" />
                {opt.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {integrations.map((integration) => (
            <div key={integration.name} className="flex items-center gap-3 rounded-md border border-border p-3">
              <integration.icon className="h-5 w-5" />
              <div className="flex-1">
                <p className="text-sm font-medium">{integration.name}</p>
                <p className="text-xs text-muted-foreground">{integration.description}</p>
              </div>
              <Button
                size="sm"
                variant={connections[integration.name] ? 'secondary' : 'outline'}
                onClick={() => {
                  setConnections((prev) => ({ ...prev, [integration.name]: !prev[integration.name] }))
                  showToast({
                    title: connections[integration.name] ? `Disconnected from ${integration.name}` : `Connected to ${integration.name}`,
                    variant: connections[integration.name] ? 'default' : 'success',
                  })
                }}
              >
                {connections[integration.name] ? 'Connected' : 'Connect'}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notificationTypes.map((n) => (
            <div key={n.key} className="flex items-center justify-between rounded-md border border-border p-3">
              <div>
                <p className="text-sm font-medium">{n.label}</p>
                <p className="text-xs text-muted-foreground">{n.description}</p>
              </div>
              <button
                onClick={() => setNotifs((prev) => ({ ...prev, [n.key]: !prev[n.key] }))}
                className={cn(
                  'relative h-6 w-11 shrink-0 rounded-full transition-colors',
                  notifs[n.key] ? 'bg-primary' : 'bg-muted'
                )}
                aria-label={`Toggle ${n.label}`}
              >
                <span
                  className={cn(
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                    notifs[n.key] ? 'translate-x-5' : 'translate-x-0.5'
                  )}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible account actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => showToast({ title: 'Account deletion requires confirmation', description: 'This is a demo — no account was deleted.', variant: 'warning' })}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
