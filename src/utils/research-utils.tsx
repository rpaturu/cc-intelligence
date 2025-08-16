import React from "react";
import { StreamingStep } from "../types/research";

export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const getInitialsFromProfile = (userData: any): string => {
  const firstName = userData.firstName || userData.name?.split(' ')[0] || '';
  const lastName = userData.lastName || userData.name?.split(' ').slice(1).join(' ') || '';
  return getInitials(firstName, lastName);
};

export const getRelevanceColor = (relevance: string): string => {
  switch (relevance) {
    case "high": return "text-green-600 bg-green-50 border-green-200";
    case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "low": return "text-gray-600 bg-gray-50 border-gray-200";
    default: return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

export const getTypeIcon = (type: string) => {
  switch (type) {
    case "article": return <div className="w-4 h-4">📄</div>;
    case "press_release": return <div className="w-4 h-4">📢</div>;
    case "report": return <div className="w-4 h-4">📊</div>;
    case "social": return <div className="w-4 h-4">👥</div>;
    case "company_page": return <div className="w-4 h-4">🏢</div>;
    case "news": return <div className="w-4 h-4">🌐</div>;
    case "research_report": return <div className="w-4 h-4">📊</div>;
    case "news_article": return <div className="w-4 h-4">📰</div>;
    default: return <div className="w-4 h-4">🌐</div>;
  }
};

export const renderTextWithMarkdownAndCitations = (
  text: string, 
  messageId: string, 
  onCitationClick: (messageId: string, sourceId: number) => void
): React.ReactNode[] => {
  // First, let's handle the markdown and citations together
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  
  // Combined regex to match both bold text and citations - Fixed the citation pattern
  const combinedPattern = /(\*\*([^*]+)\*\*)|(\[(\d+)\])/g;
  let match;
  
  while ((match = combinedPattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > currentIndex) {
      const beforeText = text.slice(currentIndex, match.index);
      if (beforeText) {
        parts.push(beforeText);
      }
    }
    
    if (match[1]) {
      // Bold text match (**text**)
      const boldText = match[2];
      parts.push(
        <strong key={`bold-${match.index}`} className="font-semibold">
          {boldText}
        </strong>
      );
    } else if (match[3]) {
      // Citation match [number] - Fixed the sourceId extraction
      const sourceId = parseInt(match[4]);
      parts.push(
        <span key={`citation-${match.index}`}>
          {" "}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Citation clicked:", sourceId, "for message:", messageId);
              onCitationClick(messageId, sourceId);
            }}
            className="inline-flex items-center justify-center w-5 h-5 text-xs bg-muted text-muted-foreground border-muted rounded border hover:bg-muted/80 hover:text-foreground hover:border-foreground/20 cursor-pointer transition-all duration-150 align-baseline font-medium shadow-sm hover:shadow-md"
            title={`View source ${sourceId}`}
          >
            {sourceId}
          </button>
        </span>
      );
    }
    
    currentIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(text.slice(currentIndex));
  }
  
  return parts;
};

export const renderTextWithCitations = (
  text: string, 
  messageId: string, 
  onCitationClick: (messageId: string, sourceId: number) => void
) => {
  return renderTextWithMarkdownAndCitations(text, messageId, onCitationClick);
};

export const getStreamingSteps = (optionId: string): StreamingStep[] => {
  const streamingSteps: Record<string, StreamingStep[]> = {
    "decision_makers": [
      { text: "🎯 Mapping organizational structure", iconName: "target", completed: false },
      { text: "🔍 Scanning LinkedIn and company directory", iconName: "search", completed: false },
      { text: "📊 Analyzing recent leadership changes", iconName: "trending-up", completed: false },
      { text: "👥 Identifying key stakeholders", iconName: "users", completed: false },
      { text: "✅ Found 8 decision makers with contact info", iconName: "check-circle", completed: false }
    ],
    "tech_stack": [
      { text: "🎯 Analyzing technology footprint", iconName: "zap", completed: false },
      { text: "🔍 Scanning job postings for tech mentions", iconName: "search", completed: false },
      { text: "📊 Reviewing engineering blog posts", iconName: "trending-up", completed: false },
      { text: "👥 Identifying tech preferences", iconName: "users", completed: false },
      { text: "✅ Found: AWS, Salesforce, React, Kubernetes", iconName: "check-circle", completed: false }
    ],
    "business_challenges": [
      { text: "🎯 Analyzing pain points and challenges", iconName: "target", completed: false },
      { text: "🔍 Scanning industry reports and news", iconName: "search", completed: false },
      { text: "📊 Reviewing investor calls and earnings", iconName: "trending-up", completed: false },
      { text: "👥 Identifying operational inefficiencies", iconName: "users", completed: false },
      { text: "✅ Found 5 key business challenges", iconName: "check-circle", completed: false }
    ],
    "competitive_positioning": [
      { text: "🎯 Analyzing competitive landscape", iconName: "target", completed: false },
      { text: "🔍 Scanning current vendor relationships", iconName: "search", completed: false },
      { text: "📊 Building value proposition battle cards", iconName: "trending-up", completed: false },
      { text: "👥 Identifying competitive positioning angles", iconName: "users", completed: false },
      { text: "✅ Found 3 key competitive opportunities", iconName: "check-circle", completed: false }
    ],
    "competitive_positioning_value_props": [
      { text: "🎯 Analyzing value proposition framework", iconName: "target", completed: false },
      { text: "🔍 Scanning competitive messaging", iconName: "search", completed: false },
      { text: "📊 Building differentiation matrix", iconName: "trending-up", completed: false },
      { text: "👥 Mapping stakeholder messaging", iconName: "users", completed: false },
      { text: "✅ Built comprehensive positioning framework", iconName: "check-circle", completed: false }
    ],
    "recent_activities": [
      { text: "🎯 Tracking recent company activities", iconName: "activity", completed: false },
      { text: "🔍 Scanning news and press releases", iconName: "search", completed: false },
      { text: "📊 Analyzing hiring patterns", iconName: "trending-up", completed: false },
      { text: "👥 Monitoring expansion signals", iconName: "users", completed: false },
      { text: "✅ Found 12 recent activities and signals", iconName: "check-circle", completed: false }
    ],
    "budget_indicators": [
      { text: "🎯 Analyzing financial health indicators", iconName: "dollar-sign", completed: false },
      { text: "🔍 Scanning funding announcements", iconName: "search", completed: false },
      { text: "📊 Reviewing spending patterns", iconName: "trending-up", completed: false },
      { text: "👥 Identifying budget allocation trends", iconName: "users", completed: false },
      { text: "✅ Found strong budget indicators", iconName: "check-circle", completed: false }
    ],
    "buying_signals": [
      { text: "🎯 Detecting purchase intent signals", iconName: "trending-up", completed: false },
      { text: "🔍 Analyzing web activity and downloads", iconName: "search", completed: false },
      { text: "📊 Monitoring procurement activities", iconName: "bar-chart", completed: false },
      { text: "👥 Tracking evaluation activities", iconName: "users", completed: false },
      { text: "✅ Found 6 strong buying signals", iconName: "check-circle", completed: false }
    ]
  };

  return streamingSteps[optionId] || [
    { text: "🎯 Analyzing request", iconName: "target", completed: false },
    { text: "🔍 Gathering data", iconName: "search", completed: false },
    { text: "📊 Processing insights", iconName: "trending-up", completed: false },
    { text: "✅ Analysis complete", iconName: "check-circle", completed: false }
  ];
};

export const downloadReport = (currentCompany: string, user: any, completedResearch: any[], format: 'pdf' | 'powerpoint' | 'word' | 'excel' | 'json' = 'json') => {
  const reportData = {
    company: currentCompany,
    generatedBy: `${user.firstName} ${user.lastName}`,
    generatedAt: new Date().toISOString(),
    completedResearch: completedResearch,
    summary: `Research report for ${currentCompany} generated by ${user.firstName} ${user.lastName} on ${new Date().toLocaleDateString()}`
  };

  let content: string;
  let mimeType: string;
  let fileExtension: string;
  const fileName = currentCompany.replace(/\s+/g, '_');

  switch (format) {
    case 'pdf':
      content = generatePDFContent(reportData);
      mimeType = 'application/pdf';
      fileExtension = 'pdf';
      break;
    case 'powerpoint':
      content = generatePowerPointContent(reportData);
      mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      fileExtension = 'pptx';
      break;
    case 'word':
      content = generateWordContent(reportData);
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      fileExtension = 'docx';
      break;
    case 'excel':
      content = generateExcelContent(reportData);
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      fileExtension = 'xlsx';
      break;
    case 'json':
    default:
      content = JSON.stringify(reportData, null, 2);
      mimeType = 'application/json';
      fileExtension = 'json';
      break;
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}_research_report.${fileExtension}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Generate content for different formats (simplified versions for demo)
const generatePDFContent = (data: any): string => {
  // In a real implementation, you'd use a library like jsPDF or PDFKit
  return `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 44 >>
stream
BT
/F1 12 Tf
72 720 Td
(Research Report for ${data.company}) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
297
%%EOF`;
};

const generatePowerPointContent = (data: any): string => {
  // In a real implementation, you'd use a library like PptxGenJS
  const slides = [
    `Research Report: ${data.company}`,
    `Generated by: ${data.generatedBy}`,
    `Date: ${new Date(data.generatedAt).toLocaleDateString()}`,
    ...data.completedResearch.map((research: any) => `${research.title}: ${research.findings.items.length} findings`)
  ];
  
  return `[PowerPoint Content]
Title: Research Report - ${data.company}
Slides: ${slides.length}
Content: ${slides.join('\n')}`;
};

const generateWordContent = (data: any): string => {
  // In a real implementation, you'd use a library like docx
  let content = `Research Report: ${data.company}\n\n`;
  content += `Generated by: ${data.generatedBy}\n`;
  content += `Date: ${new Date(data.generatedAt).toLocaleDateString()}\n\n`;
  
  data.completedResearch.forEach((research: any) => {
    content += `\n${research.title}\n`;
    content += `Completed: ${new Date(research.completedAt).toLocaleDateString()}\n\n`;
    
    research.findings.items.forEach((item: any) => {
      content += `${item.title}\n`;
      content += `${item.description}\n`;
      if (item.details) {
        item.details.forEach((detail: string) => {
          content += `• ${detail.replace(/\[\d+\]/g, '')}\n`;
        });
      }
      content += '\n';
    });
  });
  
  return content;
};

const generateExcelContent = (data: any): string => {
  // In a real implementation, you'd use a library like xlsx
  let csv = `Company,Research Area,Finding,Details,Completed Date\n`;
  
  data.completedResearch.forEach((research: any) => {
    research.findings.items.forEach((item: any) => {
      const details = item.details ? item.details.join('; ').replace(/\[\d+\]/g, '') : '';
      csv += `"${data.company}","${research.title}","${item.title}","${details}","${new Date(research.completedAt).toLocaleDateString()}"\n`;
    });
  });
  
  return csv;
};

export const parseCompanyFromInput = (input: string): string => {
  const match = input.match(/research\s+(\w+(?:\s+\w+)*)/i);
  return match?.[1] || "Acme Corp";
};

export const isResearchQuery = (input: string): boolean => {
  return input.toLowerCase().includes("research") && 
    (input.toLowerCase().includes("corp") || 
     input.toLowerCase().includes("company") || 
     input.toLowerCase().includes("acme") || 
     input.toLowerCase().includes("tesla") || 
     input.toLowerCase().includes("shopify") || 
     input.toLowerCase().includes("microsoft"));
};
