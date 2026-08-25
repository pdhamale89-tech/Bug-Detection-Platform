import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BugPlay,
  ArrowRight,
  Bot,
  ScanSearch,
  ShieldCheck,
  Gauge,
  Layers,
  GitPullRequest,
  Accessibility,
  FileText,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const features = [
  { icon: Bot, title: 'Autonomous AI Agent', description: 'An AI agent explores your app like a real user — clicking, typing, and navigating every flow it can find.' },
  { icon: ScanSearch, title: 'Evidence-First Detection', description: 'Every bug ships with screenshots, console logs, network traces, and step-by-step repro instructions.' },
  { icon: ShieldCheck, title: 'Root Cause Analysis', description: 'AI reasons about *why* a bug happens, not just that it happened, and proposes a concrete code fix.' },
  { icon: Gauge, title: 'Performance Insights', description: 'Flags slow API calls, layout shifts, and render bottlenecks against configurable budgets.' },
  { icon: Accessibility, title: 'Accessibility Audits', description: 'Automated WCAG 2.1 checks across every page the agent visits, with screen-reader-level detail.' },
  { icon: Layers, title: 'Cross-Browser Coverage', description: 'Run the same test scope across Chromium, Firefox, and WebKit in a single pass.' },
  { icon: GitPullRequest, title: 'Developer-Ready Reports', description: 'One-click Markdown export, PDF reports, or a pre-filled GitHub issue for every confirmed bug.' },
  { icon: FileText, title: 'Executive Summaries', description: 'Each test run includes a plain-language summary and prioritized action list for stakeholders.' },
]

const steps = [
  { step: 1, title: 'Submit your URL', description: 'Point BugPilot at any staging or production application.' },
  { step: 2, title: 'Configure scope', description: 'Choose functional, UI, accessibility, performance, or all of it.' },
  { step: 3, title: 'Agent explores', description: 'The AI agent navigates your app and generates test cases live.' },
  { step: 4, title: 'Bugs get evidence', description: 'Every finding is reproduced multiple times and documented.' },
  { step: 5, title: 'Ship the fix', description: 'Export developer-ready reports straight into your workflow.' },
]

const tiers = [
  { name: 'Free', price: '$0', period: 'forever', features: ['1 project', '5 test runs / month', 'Functional + UI testing', 'Community support'], cta: 'Get Started' },
  { name: 'Pro', price: '$49', period: '/mo', features: ['5 projects', 'Unlimited test runs', 'All test scopes', 'Root cause analysis', 'Email support'], cta: 'Start Free Trial', highlighted: true },
  { name: 'Team', price: '$149', period: '/mo', features: ['20 projects', 'Unlimited test runs', 'Multi-browser testing', 'GitHub / Jira / Slack integrations', 'Priority support'], cta: 'Start Free Trial' },
  { name: 'Enterprise', price: 'Custom', period: '', features: ['Unlimited projects', 'SSO & audit logs', 'Dedicated infrastructure', 'Custom SLAs', 'Dedicated success manager'], cta: 'Contact Sales' },
]

const activityLines = [
  'Navigating to /billing/checkout...',
  'Applying coupon code "SAVE20"...',
  'Clicking "Complete Purchase"...',
  'TypeError detected in console',
  'Bug confirmed: BUG-1024 (critical)',
]

export function LandingPage() {
  const [activeLine, setActiveLine] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLine((v) => (v + 1) % activityLines.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <BugPlay className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">BugPilot AI</span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">How It Works</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login"><Button variant="ghost">Sign in</Button></Link>
            <Link to="/signup"><Button>Get Started</Button></Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Evidence-First Autonomous QA
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Find Bugs Before <br /> Your Users Do.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              BugPilot AI sends an autonomous agent through your web application, reproduces every failure it finds,
              and hands your team developer-ready bug reports with full evidence attached.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup">
                <Button size="lg">
                  Test My Application <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline">See How It Works</Button>
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.15 }}>
            <Card className="overflow-hidden border-primary/20 shadow-xl">
              <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-sm font-medium">AI Agent Running</span>
                <span className="ml-auto text-xs text-muted-foreground">app.acme.com</span>
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold">Acme SaaS Platform</p>
                <p className="text-xs text-muted-foreground">https://app.acme.com</p>
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {[
                    { label: 'Pages Tested', value: '127' },
                    { label: 'User Flows', value: '34' },
                    { label: 'Issues Found', value: '8' },
                    { label: 'Critical', value: '3' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-md border border-border bg-muted/30 p-3 text-center">
                      <p className="text-xl font-bold">{s.value}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-md bg-black/40 p-3 font-mono text-xs">
                  {activityLines.map((line, i) => (
                    <p
                      key={line}
                      className={i === activeLine ? 'text-emerald-400' : 'text-muted-foreground/60'}
                    >
                      {'>'} {line}
                    </p>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Everything your QA team wishes it had time for</h2>
          <p className="mt-3 text-muted-foreground">Autonomous exploration, root cause analysis, and reports your developers will actually act on.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title} className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="border-y border-border bg-muted/20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-3 text-muted-foreground">From URL to developer-ready bug report in five steps.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-5">
            {steps.map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {s.step}
                </div>
                <h3 className="mt-4 text-sm font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Simple, transparent pricing</h2>
          <p className="mt-3 text-muted-foreground">Start free. Upgrade when your test coverage grows.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <Card key={tier.name} className={tier.highlighted ? 'relative border-primary shadow-lg' : ''}>
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                  Most Popular
                </span>
              )}
              <div className="p-6">
                <h3 className="text-sm font-semibold">{tier.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span className="text-sm text-muted-foreground">{tier.period}</span>
                </div>
                <ul className="mt-5 space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className="mt-6 block">
                  <Button className="w-full" variant={tier.highlighted ? 'default' : 'outline'}>
                    {tier.cta}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight">Ready to find what your users would find first?</h2>
        <p className="mt-3 text-muted-foreground">Set up your first AI-driven test run in under two minutes.</p>
        <Link to="/signup" className="mt-8 inline-block">
          <Button size="lg">
            Test My Application <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <BugPlay className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold">BugPilot AI</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 BugPilot AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
