import type { 
  IDigitalFootprint, 
  DigitalChannel,
  ContentType,
  EngagementLevel,
} from './types';

// SINGLE COMPREHENSIVE DATASET - Source of truth for backend integration
export const digitalFootprint: IDigitalFootprint[] = [
  {
    id: "corporate-website-presence",
    channel: "Corporate Website",
    title: "Security-Focused Website Redesign",
    contentType: "Corporate Content",
    engagement: "Growing",
    trend: "Up",
    confidence: "High",
    lastUpdated: "December 2024",
    description: "Recently redesigned website emphasizing security messaging and compliance certifications",
    metrics: {
      monthlyVisitors: "45K unique visitors",
      growthRate: "25% month-over-month",
      conversionRate: "3.2% to demo requests",
      bounceRate: "32% (improved from 48%)"
    },
    contentAnalysis: [
      "Homepage prominently features SOC 2 Type II certification",
      "Security certifications (SOC 2, PCI DSS) highlighted throughout",
      "Case studies showcase enterprise customers prominently", 
      "Technical blog covers identity architecture and FinTech security",
      "Resource center focused on compliance and regulatory content"
    ],
    audienceSignals: [
      "Technical decision makers primary audience based on content",
      "Compliance officers secondary audience via certification focus",
      "Developer community engagement through technical blog",
      "Enterprise customers showcased in case studies",
      "FinTech-specific content and use cases emphasized"
    ],
    buyingSignals: [
      "Demo request forms prominently placed",
      "Security assessment tools available for download",
      "Enterprise contact forms for large implementations",
      "Compliance checklist resources driving lead generation",
      "Technical documentation access for evaluation purposes"
    ],
    competitiveIntelligence: [
      "Positioning against generic identity providers",
      "FinTech specialization messaging throughout site",
      "Security-first messaging differentiates from productivity tools",
      "Enterprise-grade capabilities emphasized over SMB solutions"
    ]
  },
  {
    id: "linkedin-executive-presence",
    channel: "LinkedIn",
    title: "Executive Thought Leadership Growth",
    contentType: "Professional Content",
    engagement: "Very High",
    trend: "Accelerating", 
    confidence: "Confirmed",
    lastUpdated: "January 2025",
    description: "Strong executive presence with active thought leadership and company growth content",
    metrics: {
      ctoFollowers: "5,200+ followers (Sarah Chen)",
      companyFollowers: "8,500+ followers (150% growth in 6 months)",
      postEngagement: "Average 200+ likes, 50+ comments per post",
      shareRate: "25% of posts shared by employees and industry contacts"
    },
    contentAnalysis: [
      "CTO posts 2-3x weekly about FinTech security challenges",
      "Identity architecture thought leadership content",
      "Zero-trust security principles and implementation",
      "Hiring announcements and team growth updates",
      "Industry conference insights and key takeaways"
    ],
    audienceSignals: [
      "Engaging with other CTOs and security leaders",
      "FinTech industry professionals active in comments",
      "Identity management vendors monitoring content",
      "Potential customers asking technical questions",
      "Competitors engaging with and sharing content"
    ],
    buyingSignals: [
      "Direct messages about identity platform evaluations",
      "Comments from prospects asking about specific capabilities",
      "Sharing of content by evaluation committee members",
      "Engagement from target enterprise customer executives",
      "Questions about implementation timelines and pricing"
    ],
    competitiveIntelligence: [
      "Monitoring competitor posts and announcements",
      "Engaging strategically with competitor customers",
      "Positioning content to counter competitor messaging",
      "Building relationships with industry analysts and influencers"
    ]
  },
  {
    id: "engineering-blog-growth",
    channel: "Engineering Blog",
    title: "Technical Content Marketing Expansion",
    contentType: "Technical Content",
    engagement: "High",
    trend: "Up",
    confidence: "High", 
    lastUpdated: "January 2025",
    description: "Active engineering blog covering identity architecture, security implementation, and FinTech challenges",
    metrics: {
      monthlyReads: "12K unique readers",
      subscriberGrowth: "40% increase in email subscribers",
      socialShares: "Average 150+ shares per technical post",
      developerEngagement: "High comment volume from technical audience"
    },
    contentAnalysis: [
      "Identity architecture deep-dives published monthly",
      "FinTech security implementation case studies",
      "Open source contributions and tool recommendations",
      "API security best practices and tutorials",
      "Compliance automation techniques and scripts"
    ],
    audienceSignals: [
      "Enterprise developers and architects primary audience",
      "Security engineers engaged with implementation content", 
      "FinTech companies referencing content in discussions",
      "Identity management practitioners sharing insights",
      "Vendor community engaging with technical posts"
    ],
    buyingSignals: [
      "Technical evaluation questions in blog comments",
      "Requests for proof-of-concept implementations",
      "Questions about enterprise deployment capabilities",
      "Integration inquiries from developer community",
      "Architecture discussions with potential customers"
    ],
    competitiveIntelligence: [
      "Technical comparison content vs competitor solutions",
      "Open source strategy positioning vs proprietary tools",
      "Developer experience emphasis over enterprise sales focus",
      "Community-first approach vs traditional B2B marketing"
    ]
  },
  {
    id: "conference-speaking-presence",
    channel: "Industry Events",
    title: "Conference Speaking & Thought Leadership",
    contentType: "Speaking Engagements", 
    engagement: "High",
    trend: "Up",
    confidence: "High",
    lastUpdated: "Q4 2024",
    description: "Active speaking presence at FinTech conferences and security events establishing thought leadership",
    metrics: {
      speakingEngagements: "6 conferences in last 12 months",
      audienceReach: "2,500+ in-person, 10K+ virtual attendees",
      contentSyndication: "Presentation content shared across social media",
      followUpMeetings: "50+ post-conference business development meetings"
    },
    contentAnalysis: [
      "FinTech security architecture presentations",
      "Identity management implementation case studies",
      "Regulatory compliance automation workflows",
      "API security for financial services",
      "Zero-trust architecture for growing companies"
    ],
    audienceSignals: [
      "FinTech executives and technical leaders attending",
      "Regulatory and compliance professionals engaged",
      "Identity management practitioners seeking insights",
      "Potential customers in audience asking specific questions",
      "Industry analysts and media present for coverage"
    ],
    buyingSignals: [
      "Post-presentation booth visits and demo requests",
      "Follow-up meetings scheduled with prospects",
      "LinkedIn connections from attendees with buying signals", 
      "Direct inquiries about implementation services",
      "RFP invitations following conference presentations"
    ],
    competitiveIntelligence: [
      "Positioning presentations to highlight competitive advantages",
      "Attending competitor speaking sessions for intelligence",
      "Building relationships with mutual customers and prospects",
      "Monitoring competitor messaging and positioning changes"
    ]
  },
  {
    id: "social-media-growth",
    channel: "Social Media",
    title: "Multi-Platform Social Engagement Growth", 
    contentType: "Social Content",
    engagement: "Growing",
    trend: "Up",
    confidence: "High",
    lastUpdated: "January 2025",
    description: "Expanding social media presence across platforms with growing engagement and follower base",
    metrics: {
      twitterFollowers: "3,200+ followers with tech focus",
      linkedinGrowth: "150% follower increase in 6 months",
      engagementRate: "4.2% average across platforms",
      hashtagReach: "#FinTechSecurity and #IdentityManagement trending"
    },
    contentAnalysis: [
      "Industry news commentary and analysis",
      "Product update announcements and demos",
      "Team hiring and company culture content",
      "Technical tips and best practices sharing",
      "Customer success stories and case studies"
    ],
    audienceSignals: [
      "FinTech companies and security professionals engaging",
      "Potential customers asking questions in comments",
      "Industry influencers sharing and amplifying content",
      "Competitors monitoring and responding to content",
      "Recruitment candidates expressing interest"
    ],
    buyingSignals: [
      "Direct messages inquiring about platform capabilities",
      "Public questions about pricing and implementation",
      "Sharing of content by evaluation committee members",
      "Engagement from target customer decision makers",
      "Requests for deeper technical discussions"
    ],
    competitiveIntelligence: [
      "Monitoring competitor social media for announcements",
      "Engaging with competitor customers and prospects",
      "Amplifying positive customer feedback and reviews",
      "Countering competitor messaging with factual responses"
    ]
  }
];

// TRANSFORMATION UTILITIES for generating concise vs comprehensive views

// Generate concise view for chat responses
export const getDigitalFootprintConcise = (): Array<{
  channel: DigitalChannel;
  title: string;
  engagement: EngagementLevel;
  keyInsight: string;
}> => {
  return digitalFootprint.slice(0, 3).map(footprint => ({
    channel: footprint.channel,
    title: footprint.title,
    engagement: footprint.engagement,
    keyInsight: footprint.audienceSignals[0] || "Strong digital presence"
  }));
};

// Generate comprehensive view with all details
export const getDigitalFootprintComprehensive = (): IDigitalFootprint[] => {
  return digitalFootprint;
};

// Generate summary statistics from comprehensive data
export const getDigitalFootprintStats = () => {
  const highEngagementChannels = digitalFootprint.filter(d => d.engagement === "Very High" || d.engagement === "High").length;
  const growingChannels = digitalFootprint.filter(d => d.trend === "Up" || d.trend === "Accelerating").length;
  const confirmedChannels = digitalFootprint.filter(d => d.confidence === "High").length;
  
  return {
    totalChannels: digitalFootprint.length,
    highEngagementChannels,
    growingChannels,
    confirmedChannels,
    primaryChannel: digitalFootprint[0]?.channel || "Corporate Website",
    overallTrend: "Growing"
  };
};

// Generate footprint by channel
export const getFootprintByChannel = (channel: DigitalChannel) => {
  return digitalFootprint.filter(footprint => footprint.channel === channel);
};

// Generate buying signals analysis
export const getDigitalBuyingSignals = () => {
  const allSignals = digitalFootprint.flatMap(footprint => footprint.buyingSignals);
  return {
    totalSignals: allSignals.length,
    signalSources: digitalFootprint.map(d => ({
      channel: d.channel,
      signalCount: d.buyingSignals.length,
      topSignal: d.buyingSignals[0]
    }))
  };
};

// Generate competitive intelligence insights
export const getCompetitiveIntelligenceInsights = () => {
  return digitalFootprint.map(footprint => ({
    channel: footprint.channel,
    title: footprint.title,
    competitiveInsights: footprint.competitiveIntelligence,
    audienceOverlap: footprint.audienceSignals.filter(signal => 
      signal.toLowerCase().includes('competitor') || 
      signal.toLowerCase().includes('vendor')
    )
  }));
};

export const digitalChannels: DigitalChannel[] = [
  "Corporate Website",
  "LinkedIn",
  "Engineering Blog",
  "Industry Events",
  "Social Media",
  "Webinars",
  "Podcasts"
];

export const contentTypes: ContentType[] = [
  "Corporate Content",
  "Professional Content", 
  "Technical Content",
  "Speaking Engagements",
  "Social Content",
  "Video Content"
];