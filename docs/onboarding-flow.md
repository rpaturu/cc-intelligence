# Onboarding Flow Documentation

## Overview

The onboarding flow is a mandatory, progressive setup experience that captures essential vendor context from individual sales reps immediately after registration. This ensures every user has the necessary profile data to enable personalized, context-aware conversations with the AI sales assistant.

## Design Philosophy

### Problem Solved
- **Individual Rep Focus**: Targets direct-to-rep subscriptions instead of enterprise configurations
- **Vendor Context Without Complexity**: Captures company/product context without IT setup
- **Immediate Value**: Users can start meaningful conversations right after onboarding
- **Profile Completeness**: Prevents users from accessing the assistant without essential context

### Key Principles
1. **Progressive Disclosure**: Break overwhelming profile setup into digestible steps
2. **Smart Defaults**: Pre-configured company presets for quick setup
3. **Validation Gates**: Ensure essential data is captured before proceeding
4. **User-Friendly**: Visual progress indicators and clear step titles

## User Experience Flow

```
Registration → Email Confirmation → Mandatory Onboarding → Access to Assistant
```

### Step Breakdown

#### Step 1: Personal Information
- **Required**: Full Name, Role/Title
- **Optional**: Department
- **Validation**: Name and role must be provided
- **Purpose**: Establishes user identity and sales persona

#### Step 2: Company Setup
- **Quick Setup**: One-click buttons for major vendors (Okta, Palo Alto, CrowdStrike, etc.)
- **Required**: Company name
- **Optional**: Company domain, industry
- **Validation**: Company name must be provided
- **Purpose**: Establishes vendor context for competitive positioning

#### Step 3: Products & Value
- **Required**: At least 1 primary product
- **Optional**: Key value propositions
- **Interface**: Add/remove tags with visual feedback
- **Purpose**: Defines what the rep sells for product-fit analysis

#### Step 4: Competitive Intelligence
- **Required**: At least 1 main competitor
- **Interface**: Add/remove competitor tags
- **Purpose**: Enables competitive positioning and battlecard generation

#### Step 5: Sales Context
- **Optional**: Territory/region, sales focus, target industries
- **Purpose**: Tailors research depth and messaging to rep's market

## Technical Implementation

### Core Components

#### `OnboardingFlow.tsx`
- **Location**: `src/pages/OnboardingFlow.tsx`
- **Purpose**: Main onboarding component with step-by-step UI
- **Features**:
  - Progress indicator with step completion status
  - Step validation before advancing
  - Array management for products/competitors
  - Company preset integration

#### `ProtectedRoute.tsx`
- **Location**: `src/components/ProtectedRoute.tsx`
- **Purpose**: Route protection with profile completeness checks
- **Logic**:
  - Checks authentication status
  - Validates profile completeness
  - Redirects to onboarding if profile incomplete
  - Prevents onboarding loops

#### `ProfileContextTypes.ts`
- **Location**: `src/contexts/ProfileContextTypes.ts`
- **Purpose**: Company presets and type definitions
- **Features**:
  - Pre-configured data for major vendors
  - Complete product catalogs and competitor lists
  - Industry and value proposition templates

### Routing Logic

```typescript
// App.tsx routing structure
<Routes>
  {/* Authentication routes - no profile required */}
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignUpPage />} />
  <Route path="/confirm" element={<ConfirmSignUpPage />} />
  
  {/* Onboarding - auth required, profile not required */}
  <Route path="/onboarding" element={
    <ProtectedRoute requireProfileComplete={false}>
      <OnboardingFlow />
    </ProtectedRoute>
  } />
  
  {/* Main app - auth + complete profile required */}
  <Route path="/" element={
    <ProtectedRoute>
      <EnhancedIntelligenceExperience />
    </ProtectedRoute>
  } />
</Routes>
```

### Profile Completeness Validation

```typescript
const isProfileComplete = profile && 
  profile.name && 
  profile.role && 
  profile.company && 
  profile.primaryProducts.length > 0 && 
  profile.mainCompetitors.length > 0;
```

## Company Presets

### Supported Vendors
- **Atlassian**: Development tools (Jira, Confluence, Bitbucket)
- **Salesforce**: CRM platform (Sales Cloud, Service Cloud, Marketing Cloud)
- **HubSpot**: Inbound marketing and sales platform
- **Okta**: Identity and access management
- **Palo Alto Networks**: Cybersecurity platform
- **CrowdStrike**: Endpoint security

### Preset Structure
Each preset includes:
- Company name and domain
- Industry classification
- Primary products list
- Key value propositions
- Main competitors
- Target industries

### Example: Okta Preset
```typescript
'Okta': {
  company: 'Okta',
  companyDomain: 'okta.com',
  industry: 'Identity and Access Management',
  primaryProducts: ['Okta Identity Cloud', 'Workforce Identity', 'Customer Identity'],
  keyValueProps: ['Zero Trust security', 'Single sign-on (SSO)', 'Multi-factor authentication'],
  mainCompetitors: ['Microsoft Entra ID', 'Ping Identity', 'Auth0'],
  targetIndustries: ['Technology', 'Financial Services', 'Healthcare']
}
```

## Integration with Phased Approach

### How Onboarding Enables Personalization

The completed profile provides vendor context for the AI assistant:

```typescript
// Profile data becomes conversation context
userPersona: {
  name: "Taylor",
  role: "CSM", 
  company: "Okta",
  primaryProducts: ["Okta Identity Cloud"],
  mainCompetitors: ["Microsoft Entra ID", "Ping Identity"]
}
```

### Conversation Enhancement

**Before Onboarding:**
```
User: "Help me prep for Acme Corp"
Assistant: "I can help with company research. What would you like to know?"
```

**After Onboarding:**
```
User: "Help me prep for Acme Corp"
Assistant: "You're meeting with Acme Corp and you represent Okta. Since you sell Identity Cloud and compete with Microsoft Entra ID, let me look for identity infrastructure signals..."
```

## User Benefits

### For Individual Sales Reps
- **Quick Setup**: 2-3 minutes using company presets
- **Immediate Value**: Context-aware conversations from first use
- **No IT Dependency**: Self-service setup without enterprise configuration
- **Personalized Experience**: Tailored to their specific products and competitors

### For Product Development
- **User Conversion**: Mandatory onboarding ensures profile completion
- **Data Quality**: Validation ensures usable profile data
- **Feature Adoption**: Users understand value before first conversation
- **Scalability**: Supports direct-to-rep business model

## Future Enhancements

### Potential Improvements
1. **Dynamic Presets**: Load company presets from external API
2. **Role-Based Flows**: Different onboarding paths for AE, CSM, SE
3. **Progress Persistence**: Save partial progress across sessions
4. **Onboarding Analytics**: Track completion rates and drop-off points
5. **Smart Suggestions**: AI-powered product/competitor suggestions

### Integration Opportunities
1. **CRM Integration**: Pre-populate from Salesforce/HubSpot data
2. **LinkedIn Integration**: Import company and role information
3. **Email Domain Detection**: Auto-suggest company based on email domain
4. **Team Onboarding**: Shared company presets for team accounts

## Development Notes

### Dependencies
- React Router for navigation flow
- Tailwind CSS for styling
- Lucide React for icons
- shadcn/ui components for consistent UI

### State Management
- Local state for form data during onboarding
- Profile context for persistent user data
- Validation state for step progression

### Error Handling
- Form validation with user-friendly messages
- Network error handling for profile save
- Graceful fallbacks for missing preset data

## Testing Considerations

### User Flows to Test
1. **Complete Flow**: Registration → Onboarding → Main App
2. **Quick Setup**: Using company preset buttons
3. **Custom Setup**: Manual company/product entry
4. **Validation**: Step requirements and error states
5. **Navigation**: Back/forward between steps
6. **Profile Update**: Editing profile after initial setup

### Edge Cases
- Incomplete profile access attempts
- Direct URL access to onboarding when profile complete
- Network failures during profile save
- Invalid or missing preset data 

