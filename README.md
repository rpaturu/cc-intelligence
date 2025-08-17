# Sales Intelligence UI

A modern React-based user interface for the Sales Intelligence AI platform. This frontend connects to the [cc-orchestrator1](../cc-orchestrator1) backend to provide comprehensive sales intelligence reports with AI-powered analysis.

## 🚀 Features

### M3 Release (Latest)
- **📋 Guided Onboarding**: Step-by-step onboarding flow for new users
- **🏢 Company Intelligence Widgets**: Comprehensive company insights with real-time data
- **👤 Role-Based Intelligence**: AI configuration tailored to specific sales roles (AE, SE, BDR, etc.)
- **🌓 Dark Mode Support**: Complete dark/light theme switching with clean typography
- **🔐 Enhanced Authentication**: Improved sign-up, email confirmation, and login flows
- **📱 Responsive Design**: Optimized for all device sizes with consistent UI components
- **🎨 Modern UI Components**: Built with shadcn/ui for consistent design system
- **🔧 Icon System**: Centralized icon mapping with proper rendering across all components
- **🔗 Session Management**: SessionId-based authentication for improved security and performance
- **📊 Research Progress**: Visual progress tracking with proper icon display

### Core Features
- **AI-Powered Intelligence**: Generate comprehensive company insights with advanced AI analysis
- **Context-Aware Analysis**: Tailored insights based on specific sales contexts (discovery, competitive, renewal, etc.)
- **Real-time Intelligence**: Always-fresh data through real-time search and analysis
- **Comprehensive Reporting**: Company overview, pain points, competitive analysis, and more
- **Profile Management**: User profiles with role-based AI configuration
- **Company Search**: Intelligent company lookup with domain-based intelligence

## 📦 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Routing**: React Router DOM
- **Authentication**: AWS Cognito with Amplify
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite
- **Theme**: Custom CSS variables with dark/light mode support

## 🛠️ Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
```

3. **Configure your API connection:**
Edit `.env.local` with your cc-orchestrator1 API details:
```env
VITE_API_ENDPOINT=https://your-api-gateway-url.com
VITE_API_KEY=your-api-key-here
VITE_USER_POOL_ID=your-cognito-user-pool-id
VITE_USER_POOL_CLIENT_ID=your-cognito-client-id
```

4. **Start the development server:**
```bash
npm run dev
```

## 🔧 Configuration

### Environment Variables

- `VITE_API_ENDPOINT`: Your cc-orchestrator1 API Gateway URL
- `VITE_API_KEY`: Your API key for authentication
- `VITE_USER_POOL_ID`: AWS Cognito User Pool ID
- `VITE_USER_POOL_CLIENT_ID`: AWS Cognito User Pool Client ID
- `VITE_DEV_MODE`: Enable development mode features (optional)

### Authentication Configuration

The application uses **AWS Cognito** for user authentication:

- **User Pool**: Manages user accounts and authentication
- **Email-based Auth**: Primary authentication using email addresses
- **Sign-up Flow**: Email verification with OTP confirmation
- **Profile Integration**: Automatic profile creation with signup data
- **Session Management**: Secure session handling with proper auth state

### API Configuration

The application expects the cc-orchestrator1 backend to be deployed and accessible. The frontend integrates with:

- **Company Intelligence API**: Real-time company data and insights
- **User Profile API**: User management and preferences
- **Search API**: Company lookup and discovery

## 🎯 Usage

### Getting Started

1. **Sign Up**: Create an account with email verification
2. **Onboarding**: Complete the guided 3-step onboarding:
   - **Personal Information**: Name, role, department
   - **Company Information**: Search and select your company
   - **Sales Context**: Territory and focus preferences
3. **Profile Setup**: AI configuration based on your role

### Generating Intelligence Reports

1. **Navigate to Research**: Use the main navigation or profile quick actions
2. **Company Selection**: Search for target companies by name or domain
3. **Context Selection**: Choose your sales context and research type
4. **AI Configuration**: Leverage role-specific AI insights
5. **Real-time Intelligence**: Get comprehensive company insights

### Company Intelligence Features

The **Company Intelligence Widget** provides:

- **📊 Company Overview**: Size, market presence, business challenges
- **🏭 Industry Analysis**: Sector-specific insights and positioning
- **💼 Products & Services**: Product portfolio and service offerings
- **🎯 Target Markets**: Customer segments and market focus
- **💰 Value Propositions**: Key value drivers and differentiators
- **🏆 Competitive Landscape**: Market position and competitors
- **⚡ Technology Stack**: Technical infrastructure and tools
- **👥 Key Executives**: Leadership team and stakeholders
- **📰 Recent News**: Latest company updates and announcements
- **🤝 Key Partnerships**: Strategic alliances and integrations
- **📈 Growth Indicators**: Business momentum and expansion signals
- **🎯 AI Configuration**: Role-specific intelligence focus

### Role-Based Intelligence

The platform adapts to different sales roles:

- **Account Executive (AE)**: Revenue-focused insights, deal velocity, buying signals
- **Solutions Engineer (SE)**: Technical requirements, integration complexity, use cases
- **Sales Development (SDR/BDR)**: Prospecting insights, contact strategies, qualification
- **Customer Success (CSM)**: Expansion opportunities, health scores, retention factors
- **Sales Manager**: Team performance, pipeline analysis, coaching insights

## 🎨 Design System

### Theme Support
- **Light/Dark Modes**: Complete theme switching with consistent colors
- **Typography**: Clean, readable fonts with proper contrast ratios
- **Color Palette**: Neutral color scheme with semantic color usage
- **Component Library**: shadcn/ui components with custom styling

### UI Components
- **Navigation**: Responsive navbar with role-based navigation
- **Forms**: Validated forms with error handling and loading states
- **Cards**: Information cards with consistent spacing and hierarchy
- **Badges**: Status indicators with theme-aware colors
- **Progress Indicators**: Step-by-step progress tracking

## 🔗 Backend Integration

This UI is designed to work with the cc-orchestrator1 backend. Key integrations:

### Company Intelligence API
```typescript
// Company data with comprehensive insights
interface CompanyIntelligenceData {
  companyName: string;
  industry: string;
  products: string[];
  targetMarkets: string[];
  competitors: string[];
  valuePropositions: string[];
  // ... extensive company data
}
```

### Profile Management API
```typescript
// User profile with role-based configuration
interface UserProfile {
  userId: string;
  email: string;
  name: string;
  role: string;
  company: string;
  // ... additional profile fields
}
```

### Real-time Features
- **Polling Support**: Async result polling for long-running operations
- **Cache Management**: Intelligent caching with freshness indicators
- **Error Handling**: Comprehensive error states and retry mechanisms

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Infrastructure

The application includes AWS CDK infrastructure:

```bash
cd infrastructure
npm install
cdk deploy
```

This deploys:
- **S3 Bucket**: Static website hosting
- **CloudFront**: Global CDN distribution
- **IAM Roles**: Secure access policies

## 🔒 Security

- **Authentication**: AWS Cognito with secure session management
- **API Security**: CORS configuration and API key validation
- **Input Validation**: Comprehensive form validation with Zod schemas
- **Environment Variables**: Secure configuration management
- **HTTPS Only**: All API communication over secure connections

## 📱 Mobile Support

Fully responsive design supporting:
- **Desktop**: Full-featured experience with optimized layouts
- **Tablet**: Touch-friendly interface with responsive grids
- **Mobile**: Compact layouts with accessible navigation

## 🧪 Testing

### Development Testing
```bash
npm run lint          # TypeScript and ESLint checks
npm run type-check    # TypeScript compilation
npm run dev          # Development server with hot reload
```

### Build Testing
```bash
npm run build        # Production build
npm run preview      # Preview production build
```

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Verify Cognito User Pool configuration
   - Check email confirmation status
   - Ensure proper redirect URLs

2. **API Connection Errors**:
   - Verify backend service is running
   - Check API endpoint configuration
   - Validate CORS settings

3. **Build Issues**:
   - Clear cache: `rm -rf node_modules .vite && npm install`
   - Check TypeScript errors: `npm run type-check`
   - Verify environment variables

4. **Theme Issues**:
   - Check CSS variable definitions
   - Verify component class usage
   - Ensure proper dark mode detection

## 🔄 Release History

### M3-frontend (Current)
- ✅ Guided onboarding flow
- ✅ Company intelligence widgets
- ✅ Role-based AI configuration
- ✅ Dark mode support
- ✅ Enhanced authentication
- ✅ Improved UI/UX consistency
- ✅ Centralized icon system with proper rendering
- ✅ SessionId-based authentication
- ✅ Research progress tracking with icons
- ✅ GDPR compliance features (consent management, data export, account deletion)

### M2-frontend
- ✅ Core intelligence features
- ✅ User authentication
- ✅ Basic company search

### M1-frontend
- ✅ Initial UI foundation
- ✅ Basic routing and layout

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with proper TypeScript typing
4. Test thoroughly across themes and devices
5. Submit a pull request with clear description

### Development Guidelines
- Follow TypeScript best practices
- Use semantic component naming
- Maintain theme consistency
- Test in both light and dark modes
- Ensure mobile responsiveness

## 📄 License

This project is licensed under the MIT License.

## 🔗 Related Projects

- [cc-orchestrator1](../cc-orchestrator1): The backend API service
- [sales-intelligence-app-concept.md](../cc-orchestrator1/sales-intelligence-app-concept.md): Original concept document
