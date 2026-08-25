import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Rocket } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/stores/app-store'
import { cn, scopeLabel } from '@/lib/utils'
import type { AuthType, BrowserType, Environment, TestScope } from '@/types'

const allScopes: TestScope[] = [
  'functional',
  'ui-ux',
  'accessibility',
  'performance',
  'responsive',
  'navigation',
  'forms',
  'authentication',
  'api-network',
  'console-errors',
]

export function CreateProjectPage() {
  const navigate = useNavigate()
  const showToast = useAppStore((s) => s.showToast)

  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [environment, setEnvironment] = useState<Environment>('staging')
  const [authType, setAuthType] = useState<AuthType>('none')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [customAuthNotes, setCustomAuthNotes] = useState('')
  const [scope, setScope] = useState<TestScope[]>(['functional', 'ui-ux', 'navigation'])
  const [instructions, setInstructions] = useState('')
  const [maxDuration, setMaxDuration] = useState(30)
  const [browser, setBrowser] = useState<BrowserType>('chromium')
  const [submitting, setSubmitting] = useState(false)

  function toggleScope(s: TestScope) {
    setScope((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!url.trim()) {
      showToast({ title: 'URL is required', variant: 'error' })
      return
    }
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 500))
    showToast({ title: 'Test started', description: 'The AI agent is now exploring your application.', variant: 'success' })
    navigate('/projects/proj_01/test')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Project / Test</h1>
        <p className="text-sm text-muted-foreground">Configure your application and let the AI agent take it from here.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Application</CardTitle>
            <CardDescription>Basic information about what to test.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Project name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme SaaS Platform" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Application URL <span className="text-destructive">*</span>
              </label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://app.example.com" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Description</label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does this application do?" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Environment</label>
              <Select value={environment} onChange={(e) => setEnvironment(e.target.value as Environment)}>
                <option value="production">Production</option>
                <option value="staging">Staging</option>
                <option value="development">Development</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>Does the agent need to log in to reach protected pages?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={authType} onChange={(e) => setAuthType(e.target.value as AuthType)}>
              <option value="none">No authentication required</option>
              <option value="credentials">Username & password</option>
              <option value="custom">Custom (SSO / multi-step)</option>
            </Select>
            {authType === 'credentials' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Username / Email</label>
                  <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="test@example.com" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Password</label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
            )}
            {authType === 'custom' && (
              <div>
                <label className="mb-1.5 block text-sm font-medium">Notes for the agent</label>
                <Textarea
                  value={customAuthNotes}
                  onChange={(e) => setCustomAuthNotes(e.target.value)}
                  placeholder="Describe the login flow (e.g. SSO redirect, OTP, magic link)..."
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Scope</CardTitle>
            <CardDescription>Select which types of testing the agent should perform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {allScopes.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggleScope(s)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                    scope.includes(s)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-transparent text-muted-foreground hover:border-primary/40'
                  )}
                >
                  {scopeLabel(s)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
            <CardDescription>Give the AI agent context: key flows, edge cases, or areas of concern.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Focus on the checkout flow with and without coupon codes. Also test the mobile navigation menu."
              className="min-h-[110px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Max duration</label>
              <Select value={maxDuration} onChange={(e) => setMaxDuration(Number(e.target.value))}>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Browser</label>
              <Select value={browser} onChange={(e) => setBrowser(e.target.value as BrowserType)}>
                <option value="chromium">Chromium</option>
                <option value="firefox">Firefox</option>
                <option value="webkit">WebKit</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/projects')}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            <Rocket className="h-4 w-4" /> Start AI Test
          </Button>
        </div>
      </form>
    </div>
  )
}
