import { QUESTION_REGISTRY, QuestionContext, StreamingStep } from './QuestionRegistry'
import { getResearchFindings, getMockSources } from '../../utils/researchFindings'
import { Search, FileText, BarChart3, CheckCircle } from 'lucide-react'

export interface RunQuestionCallbacks {
  onStart: (steps: StreamingStep[]) => void
  onProgress: (stepIndex: number) => void
  onComplete: (result: { findings: any; sources: any }) => void
  onError: (error: Error) => void
}

/**
 * Simulates a question run (pre-SSE) using the registry to provide streaming steps
 * and local findings/sources utilities. Returns a cancel function.
 */
export function runQuestion(
  areaId: string,
  researchAreaTitle: string,
  company: string,
  context: QuestionContext,
  callbacks: RunQuestionCallbacks
): () => void {
  let cancelled = false

  try {
    const def = QUESTION_REGISTRY[areaId]
    const steps = def?.getStreamingSteps(context) ?? getDefaultSteps(researchAreaTitle)

    callbacks.onStart(steps)

    steps.forEach((_, index) => {
      setTimeout(() => {
        if (cancelled) return
        callbacks.onProgress(index)
      }, (index + 1) * 1000)
    })

    setTimeout(() => {
      if (cancelled) return
      const findings = getResearchFindings(areaId, company)
      const sources = getMockSources(company, areaId)
      callbacks.onComplete({ findings, sources })
    }, steps.length * 1000 + 500)
  } catch (error) {
    callbacks.onError(error as Error)
  }

  return () => {
    cancelled = true
  }
}

function getDefaultSteps(researchAreaTitle: string): StreamingStep[] {
  const topic = researchAreaTitle.toLowerCase()
  return [
    { 
      text: `Analyzing ${topic} data`, 
      icon: <BarChart3 className="w-4 h-4" />
    },
    { 
      text: 'Scanning industry reports and news', 
      icon: <Search className="w-4 h-4" />
    },
    { 
      text: 'Reviewing public signals and disclosures', 
      icon: <FileText className="w-4 h-4" />
    },
    { 
      text: `Found key ${topic} insights`, 
      icon: <CheckCircle className="w-4 h-4" />
    },
  ]
}


