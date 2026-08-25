import type { TestConfig, TestRun, AgentEvent, TestRunner } from '@/types'
import { mockTestRuns, generateMockEvents } from '@/data/mock-data'

export class MockTestRunner implements TestRunner {
  async startTest(config: TestConfig): Promise<TestRun> {
    await new Promise((r) => setTimeout(r, 300))
    const base = mockTestRuns[0]
    return {
      ...base,
      id: 'run_live',
      projectId: config.projectId ?? base.projectId,
      projectName: config.name || base.projectName,
      url: config.url || base.url,
      environment: config.environment,
      status: 'running',
      events: generateMockEvents(),
    }
  }

  async getStatus(id: string): Promise<TestRun> {
    await new Promise((r) => setTimeout(r, 150))
    const run = mockTestRuns.find((r) => r.id === id) ?? mockTestRuns[0]
    return run
  }

  async getEvents(_id: string): Promise<AgentEvent[]> {
    await new Promise((r) => setTimeout(r, 100))
    return generateMockEvents()
  }

  async cancelTest(_id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 200))
  }

  async retryTest(id: string): Promise<TestRun> {
    await new Promise((r) => setTimeout(r, 300))
    const run = mockTestRuns.find((r) => r.id === id) ?? mockTestRuns[0]
    return { ...run, id: 'run_retry', status: 'running' }
  }
}

export const testRunner = new MockTestRunner()
