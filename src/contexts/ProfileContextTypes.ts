import type { UserProfile } from '../lib/api';

// Re-export UserProfile for convenience
export type { UserProfile };

// Predefined company data for common companies
export const companyPresets: Record<string, Partial<UserProfile>> = {
  'Atlassian': {
    company: 'Atlassian',
    companyDomain: 'atlassian.com',
    industry: 'Software Development Tools',
    primaryProducts: ['Jira', 'Confluence', 'Bitbucket', 'Trello', 'Jira Service Management'],
    keyValueProps: [
      'Team collaboration and productivity',
      'Developer workflow optimization',
      'Agile project management',
      'Knowledge management',
      'DevOps automation'
    ],
    mainCompetitors: [
      'Linear', 'Asana', 'Monday.com', 'Notion', 'GitHub', 
      'Azure DevOps', 'ClickUp', 'Wrike', 'Smartsheet'
    ],
    targetIndustries: ['Software Development', 'IT Services', 'Technology', 'Financial Services']
  },
  'Salesforce': {
    company: 'Salesforce',
    companyDomain: 'salesforce.com',
    industry: 'Customer Relationship Management',
    primaryProducts: ['Sales Cloud', 'Service Cloud', 'Marketing Cloud', 'Commerce Cloud', 'Tableau'],
    keyValueProps: [
      'AI-powered CRM',
      'Customer 360 platform',
      'Automation and workflow',
      'Analytics and insights'
    ],
    mainCompetitors: ['HubSpot', 'Microsoft Dynamics', 'Oracle CX', 'SAP CRM', 'Pipedrive'],
    targetIndustries: ['All Industries', 'Retail', 'Financial Services', 'Healthcare', 'Manufacturing']
  },
  'HubSpot': {
    company: 'HubSpot',
    companyDomain: 'hubspot.com',
    industry: 'Inbound Marketing & Sales',
    primaryProducts: ['Marketing Hub', 'Sales Hub', 'Service Hub', 'CMS Hub', 'Operations Hub'],
    keyValueProps: [
      'Inbound marketing methodology',
      'All-in-one growth platform',
      'Easy to use and implement',
      'Strong content management'
    ],
    mainCompetitors: ['Salesforce', 'Marketo', 'Pardot', 'ActiveCampaign', 'Pipedrive'],
    targetIndustries: ['Small Business', 'Marketing Agencies', 'E-commerce', 'SaaS', 'Professional Services']
  },
  'Okta': {
    company: 'Okta',
    companyDomain: 'okta.com',
    industry: 'Identity and Access Management',
    primaryProducts: ['Okta Identity Cloud', 'Workforce Identity', 'Customer Identity', 'Lifecycle Management', 'Adaptive MFA'],
    keyValueProps: [
      'Zero Trust security',
      'Single sign-on (SSO)',
      'Multi-factor authentication',
      'Identity governance',
      'API access management'
    ],
    mainCompetitors: ['Microsoft Entra ID', 'Ping Identity', 'Auth0', 'CyberArk', 'SailPoint'],
    targetIndustries: ['Technology', 'Financial Services', 'Healthcare', 'Government', 'Retail']
  },
  'Palo Alto Networks': {
    company: 'Palo Alto Networks',
    companyDomain: 'paloaltonetworks.com',
    industry: 'Cybersecurity',
    primaryProducts: ['Prisma Cloud', 'Cortex XDR', 'Next-Generation Firewalls', 'Prisma Access', 'GlobalProtect'],
    keyValueProps: [
      'Cloud-native security',
      'Zero Trust architecture',
      'AI-powered threat detection',
      'Comprehensive visibility',
      'Automated response'
    ],
    mainCompetitors: ['CrowdStrike', 'Fortinet', 'Check Point', 'Zscaler', 'SentinelOne'],
    targetIndustries: ['Enterprise', 'Government', 'Financial Services', 'Healthcare', 'Critical Infrastructure']
  },
  'CrowdStrike': {
    company: 'CrowdStrike',
    companyDomain: 'crowdstrike.com',
    industry: 'Endpoint Security',
    primaryProducts: ['Falcon Complete', 'Falcon Prevent', 'Falcon Insight', 'Falcon X', 'Falcon Intelligence'],
    keyValueProps: [
      'Cloud-native endpoint protection',
      'Real-time threat detection',
      'Managed detection and response',
      'Threat intelligence',
      'Incident response'
    ],
    mainCompetitors: ['SentinelOne', 'Palo Alto Cortex XDR', 'Microsoft Defender', 'Carbon Black', 'Symantec'],
    targetIndustries: ['Enterprise', 'Government', 'Healthcare', 'Financial Services', 'Technology']
  }
}; 