export interface MessageFeedback {
  messageId: string;
  rating: 'positive' | 'negative' | null;
  detailedFeedback?: string;
  timestamp: Date;
  researchArea?: string;
  companyName?: string;
  userRole?: string;
}

export interface FeedbackAnalytics {
  totalResponses: number;
  positiveRating: number;
  negativeRating: number;
  detailedFeedbackCount: number;
  avgResponsesByArea: Record<string, { positive: number; negative: number; total: number }>;
}

const FEEDBACK_STORAGE_KEY = 'research_assistant_feedback';

export const saveFeedback = (feedback: MessageFeedback): void => {
  try {
    const existingFeedback = getFeedbackData();
    const updatedFeedback = existingFeedback.filter(f => f.messageId !== feedback.messageId);
    updatedFeedback.push(feedback);
    
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updatedFeedback));
    console.log('✅ Feedback saved successfully:', feedback);
  } catch (error) {
    console.error('❌ Error saving feedback:', error);
  }
};

export const getFeedbackData = (): MessageFeedback[] => {
  try {
    const data = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    return parsed.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp)
    }));
  } catch (error) {
    console.error('❌ Error retrieving feedback:', error);
    return [];
  }
};

export const getFeedbackForMessage = (messageId: string): MessageFeedback | null => {
  const allFeedback = getFeedbackData();
  return allFeedback.find(f => f.messageId === messageId) || null;
};

export const generateFeedbackAnalytics = (): FeedbackAnalytics => {
  const allFeedback = getFeedbackData();
  
  const analytics: FeedbackAnalytics = {
    totalResponses: allFeedback.length,
    positiveRating: allFeedback.filter(f => f.rating === 'positive').length,
    negativeRating: allFeedback.filter(f => f.rating === 'negative').length,
    detailedFeedbackCount: allFeedback.filter(f => f.detailedFeedback?.trim()).length,
    avgResponsesByArea: {}
  };

  // Group by research area
  const byArea = allFeedback.reduce((acc, feedback) => {
    const area = feedback.researchArea || 'general';
    if (!acc[area]) {
      acc[area] = { positive: 0, negative: 0, total: 0 };
    }
    
    acc[area].total++;
    if (feedback.rating === 'positive') acc[area].positive++;
    if (feedback.rating === 'negative') acc[area].negative++;
    
    return acc;
  }, {} as Record<string, { positive: number; negative: number; total: number }>);

  analytics.avgResponsesByArea = byArea;
  return analytics;
};

export const exportFeedbackData = (): string => {
  const feedback = getFeedbackData();
  const analytics = generateFeedbackAnalytics();
  
  return JSON.stringify({
    exportDate: new Date().toISOString(),
    analytics,
    feedbackData: feedback
  }, null, 2);
};

export const clearFeedbackData = (): void => {
  try {
    localStorage.removeItem(FEEDBACK_STORAGE_KEY);
    console.log('✅ Feedback data cleared');
  } catch (error) {
    console.error('❌ Error clearing feedback data:', error);
  }
};