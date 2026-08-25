export type BugSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info'
export type BugStatus = 'confirmed' | 'potential' | 'observation' | 'resolved' | 'false-positive' | 'duplicate'
export type BugCategory =
  | 'functional'
  | 'ui'
  | 'accessibility'
  | 'performance'
  | 'navigation'
  | 'security'
  | 'console-error'
  | 'network-error'
export type TestRunStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'
export type TestCaseStatus = 'pending' | 'running' | 'passed' | 'failed' | 'skipped' | 'warning'
export type Environment = 'production' | 'staging' | 'development'
export type TestScope =
  | 'functional'
  | 'ui-ux'
  | 'accessibility'
  | 'performance'
  | 'responsive'
  | 'navigation'
  | 'forms'
  | 'authentication'
  | 'api-network'
  | 'console-errors'
export type AuthType = 'none' | 'credentials' | 'custom'
export type BrowserType = 'chromium' | 'firefox' | 'webkit'

export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  role: string
  organizationId: string
}

export interface Organization {
  id: string
  name: string
  plan: 'free' | 'pro' | 'team' | 'enterprise'
}

export interface HealthScore {
  overall: number
  functional: number
  ui: number
  accessibility: number
  performance: number
  reliability: number
}

export interface Project {
  id: string
  name: string
  url: string
  description: string
  environment: Environment
  healthScore: HealthScore
  totalBugs: number
  openBugs: number
  resolvedBugs: number
  totalTestRuns: number
  lastTestedAt: string
  createdAt: string
}

export interface TestConfig {
  projectId?: string
  name: string
  url: string
  description: string
  environment: Environment
  authType: AuthType
  username?: string
  password?: string
  customAuthNotes?: string
  scope: TestScope[]
  instructions: string
  maxDuration: number
  browser: BrowserType
}

export interface Evidence {
  id: string
  type: 'screenshot' | 'video' | 'har'
  label: string
  url: string
  timestamp: string
}

export interface ConsoleLog {
  id: string
  level: 'log' | 'warn' | 'error' | 'info'
  message: string
  timestamp: string
  source?: string
}

export interface NetworkLog {
  id: string
  method: string
  url: string
  status: number
  duration: number
  timestamp: string
}

export interface BrowserInfo {
  browser: BrowserType
  viewport: string
  os: string
  userAgent: string
}

export interface Bug {
  id: string
  displayId: string
  testRunId: string
  projectId: string
  title: string
  description: string
  category: BugCategory
  severity: BugSeverity
  status: BugStatus
  confidence: number
  url: string
  stepsToReproduce: string[]
  expectedBehavior: string
  actualBehavior: string
  rootCause: string
  suggestedResolution: string
  developerFix: string
  regressionTest: string
  impact: string
  evidence: Evidence[]
  consoleLogs: ConsoleLog[]
  networkLogs: NetworkLog[]
  browserInfo: BrowserInfo
  reproductionAttempts: number
  reproductionSuccesses: number
  aiAnalysis: string
  firstSeenAt: string
  lastSeenAt: string
  createdAt: string
}

export interface TestCase {
  id: string
  testRunId: string
  name: string
  description: string
  status: TestCaseStatus
  category: BugCategory
  durationMs: number
}

export interface AgentEvent {
  id: string
  type:
    | 'page-loaded'
    | 'navigation'
    | 'element-discovered'
    | 'interaction'
    | 'form-detected'
    | 'test-generated'
    | 'test-passed'
    | 'test-failed'
    | 'console-error'
    | 'network-error'
    | 'bug-suspected'
    | 'bug-reproduced'
    | 'bug-confirmed'
    | 'accessibility-issue'
    | 'performance-issue'
    | 'phase-change'
    | 'completed'
  message: string
  timestamp: string
}

export interface TestRun {
  id: string
  projectId: string
  projectName: string
  url: string
  environment: Environment
  status: TestRunStatus
  startedAt: string
  completedAt?: string
  durationSeconds: number
  pagesTested: number
  testCasesTotal: number
  testCasesPassed: number
  testCasesFailed: number
  testCasesWarning: number
  testCasesSkipped: number
  bugsFound: number
  criticalCount: number
  highCount: number
  mediumCount: number
  lowCount: number
  healthScore: HealthScore
  executiveSummary: string
  recommendations: string[]
  testCases: TestCase[]
  events: AgentEvent[]
}

export type NotificationType = 'bug-found' | 'test-complete' | 'test-failed' | 'system'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: string
  link?: string
}

export interface PageAnalysis {
  url: string
  elements: string[]
  forms: string[]
  issues: string[]
}

export interface FailureAnalysis {
  summary: string
  rootCause: string
  confidence: number
}

export interface RootCauseAnalysis {
  rootCause: string
  suggestedResolution: string
  developerFix: string
}

export interface TestRunner {
  startTest(config: TestConfig): Promise<TestRun>
  getStatus(id: string): Promise<TestRun>
  getEvents(id: string): Promise<AgentEvent[]>
  cancelTest(id: string): Promise<void>
  retryTest(id: string): Promise<TestRun>
}

export interface AIProvider {
  analyzePage(dom: string, screenshot?: string): Promise<PageAnalysis>
  generateTests(appDescription: string, pageStructure: string): Promise<TestCase[]>
  analyzeFailure(evidence: Evidence[], logs: ConsoleLog[], network: NetworkLog[]): Promise<FailureAnalysis>
  generateBugReport(failure: FailureAnalysis): Promise<Bug>
  analyzeRootCause(bug: Bug): Promise<RootCauseAnalysis>
}
