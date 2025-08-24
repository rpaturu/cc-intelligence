/**
 * SSEProgressMapper - Maps SSE events to progress steps for different research areas
 * 
 * This system provides a unified way to map server-sent events to user-facing progress steps
 * for different research areas, ensuring consistent progress tracking across the application.
 */

export interface SSEProgressMapping {
  researchAreaId: string;
  eventMappings: {
    collection_started: string;
    progress_update: string;
    sources_found: string;
    research_findings: string;
    research_complete: string;
  };
}

export interface BackendEventDescriptions {
  // Dynamic event descriptions - keys match backend eventTypes
  [key: string]: string;
}

export interface BackendEventIcons {
  // Dynamic event icons - keys match backend eventTypes
  [key: string]: string;
}

export interface StreamingStep {
  text: string;
  iconName: string;
  completed: boolean;
}

export class SSEProgressMapper {
  private static progressMappings: Record<string, SSEProgressMapping> = {
    company_overview: {
      researchAreaId: 'company_overview',
      eventMappings: {
        collection_started: '🎯 Creating comprehensive research plan',
        progress_update: '🔍 Collecting company data from multiple sources',
        sources_found: '📊 Analyzing financial and market position',
        research_findings: '👥 Mapping leadership and organizational structure',
        research_complete: '✅ Generated comprehensive company overview'
      }
    },
    decision_makers: {
      researchAreaId: 'decision_makers',
      eventMappings: {
        collection_started: '🎯 Mapping organizational structure',
        progress_update: '🔍 Scanning LinkedIn and company directory',
        sources_found: '📊 Analyzing recent leadership changes',
        research_findings: '👥 Identifying key stakeholders',
        research_complete: '✅ Found key decision makers with contact info'
      }
    },
    tech_stack: {
      researchAreaId: 'tech_stack',
      eventMappings: {
        collection_started: '🎯 Analyzing technology infrastructure',
        progress_update: '🔍 Scanning development tools and platforms',
        sources_found: '📊 Mapping technology stack components',
        research_findings: '💻 Identifying key technologies and frameworks',
        research_complete: '✅ Technology stack analysis complete'
      }
    },
    business_challenges: {
      researchAreaId: 'business_challenges',
      eventMappings: {
        collection_started: '🎯 Identifying business challenges',
        progress_update: '🔍 Analyzing operational pain points',
        sources_found: '📊 Mapping business challenges and risks',
        research_findings: '⚠️ Identifying key business challenges',
        research_complete: '✅ Business challenges analysis complete'
      }
    }
  };

  static getProgressSteps(researchAreaId: string): StreamingStep[] {
    const mapping = this.progressMappings[researchAreaId];
    if (!mapping) return this.getDefaultSteps(researchAreaId);

    return Object.entries(mapping.eventMappings).map(([event, text]) => ({
      text,
      iconName: this.getIconForEvent(event),
      completed: false
    }));
  }

  static getIconForEvent(event: string): string {
    const iconMap: Record<string, string> = {
      // User-focused event types
      research_started: 'play',
      data_gathering: 'search',
      analysis_in_progress: 'brain',
      synthesis_complete: 'sparkles',
      research_complete: 'check-square',
      
      // Legacy support
      collection_started: 'target',
      progress_update: 'search',
      sources_found: 'bar-chart',
      research_findings: 'users'
    };
    return iconMap[event] || 'circle';
  }

  static getStepIndexForEvent(eventType: string, backendEventTypes?: string[]): number {
    // Use backend event types if provided, otherwise fall back to default
    const eventOrder = backendEventTypes || [
      'research_started',      // Fallback: Research begins
      'data_gathering',        // Fallback: Gathering information
      'analysis_in_progress',  // Fallback: AI analysis (longest step)
      'synthesis_complete',    // Fallback: Analysis complete
      'research_complete'      // Fallback: Research finished
    ];
    return eventOrder.indexOf(eventType);
  }

  private static getDefaultSteps(researchAreaId: string): StreamingStep[] {
    return [
      {
        text: `🎯 Starting ${researchAreaId} research`,
        iconName: 'target',
        completed: false
      },
      {
        text: '🔍 Collecting data from multiple sources',
        iconName: 'search',
        completed: false
      },
      {
        text: '📊 Analyzing information',
        iconName: 'bar-chart',
        completed: false
      },
      {
        text: '✅ Research complete',
        iconName: 'check-square',
        completed: false
      }
    ];
  }

  /**
   * Create progress steps from backend event descriptions and icons
   * This allows the frontend to display real descriptions immediately
   */
  static getProgressStepsFromBackendDescriptions(
    eventDescriptions: BackendEventDescriptions,
    backendEventTypes?: string[],
    backendEventIcons?: BackendEventIcons,
    researchAreaId: string = 'company_overview'
  ): StreamingStep[] {
    // Use backend event types if provided, otherwise fall back to default
    const eventOrder = backendEventTypes || [
      'research_started',      // Fallback: Research begins
      'data_gathering',        // Fallback: Gathering information
      'analysis_in_progress',  // Fallback: AI analysis (longest step)
      'synthesis_complete',    // Fallback: Analysis complete
      'research_complete'      // Fallback: Research finished
    ];

    return eventOrder.map(eventType => ({
      text: eventDescriptions[eventType] || this.getDefaultSteps(researchAreaId)[0].text,
      iconName: backendEventIcons?.[eventType] || this.getIconForEvent(eventType),
      completed: false
    }));
  }
}
