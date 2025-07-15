# Sales Intelligence UI

A modern React-based user interface for the Sales Intelligence AI platform. This frontend connects to the [cc-orchestrator1](../cc-orchestrator1) backend to provide comprehensive sales intelligence reports with AI-powered analysis.

## 🚀 Features

- **AI-Powered Intelligence**: Generate comprehensive company insights with advanced AI analysis
- **Context-Aware Analysis**: Tailored insights based on specific sales contexts (discovery, competitive, renewal, etc.)
- **Real-time Intelligence**: Always-fresh data through real-time search and analysis
- **Comprehensive Reporting**: Company overview, pain points, competitive analysis, and more
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 📦 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite

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

The application uses **AWS Cognito** for user authentication with proper loginId management:

- **User Pool**: Manages user accounts and authentication
- **Sign-up**: Email verification required
- **Sign-in**: Email or username with password
- **Login ID**: Uses the user's email as the loginId for proper authentication context

### API Configuration

The application expects the cc-orchestrator1 backend to be deployed and accessible. Make sure your backend is running and the API endpoints are configured correctly.

## 🎯 Usage

### Generating Intelligence Reports

1. **Navigate to Intelligence**: Click on "Intelligence" in the sidebar or use the quick action on the home page
2. **Enter Company Domain**: Input the target company's domain (e.g., "shopify.com")
3. **Select Sales Context**: Choose from:
   - **Discovery**: Initial research and pain point identification
   - **Competitive**: Competitor analysis and positioning
   - **Renewal**: Contract renewal and satisfaction analysis
   - **Demo**: Technical requirements and use cases
   - **Negotiation**: Procurement and budget approval
   - **Closing**: Final decision and implementation planning
4. **Add Context** (Optional): Provide additional context about the meeting or opportunity
5. **Generate Report**: Click "Generate Intelligence" to create the report

### Understanding Reports

The generated reports include:

- **Company Overview**: Industry, size, revenue, recent news
- **Pain Points**: Key challenges and areas of concern
- **Key Contacts**: Important stakeholders and approach strategies
- **Competitive Landscape**: Market position and differentiators
- **Talking Points**: Relevant conversation topics
- **Deal Probability**: AI-calculated likelihood of success
- **Sources**: References and data sources used

### Navigation

- **Home**: Overview and quick actions
- **Intelligence**: Generate and view reports
- **Analytics**: Performance metrics (coming soon)
- **Settings**: Configure API and preferences

## 🔗 Backend Integration

This UI is designed to work with the cc-orchestrator1 backend. The backend provides three main endpoints:

1. **Intelligence Generation**: `POST /intelligence`
2. **Health Check**: `GET /health`  
3. **Search**: `POST /search`

### API Response Format

The backend returns structured data including:

```typescript
interface SalesIntelligenceResponse {
  insights: {
    companyOverview: CompanyInsights;
    painPoints: string[];
    keyContacts: Contact[];
    competitiveLandscape: CompetitiveIntel;
    talkingPoints: string[];
    dealProbability: number;
    // ... more fields
  };
  sources: string[];
  confidenceScore: number;
  generatedAt: Date;
  requestId: string;
}
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deployment Options

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **AWS S3 + CloudFront**: Upload the built files to S3 and serve via CloudFront
- **Any static hosting service**: The built files are static and can be served anywhere

## 🔒 Security

- API keys are stored in environment variables
- All API calls use HTTPS
- CORS is configured on the backend
- Input validation is performed on all forms

## 🎨 Customization

### Styling

The application uses Tailwind CSS for styling. You can customize the design by:

1. **Modifying colors**: Edit `tailwind.config.js`
2. **Adding components**: Create new components in `src/components/`
3. **Updating themes**: Modify CSS variables in `src/index.css`

### Adding Features

The architecture supports easy extension:

1. **New pages**: Add to `src/pages/` and update routes in `App.tsx`
2. **New components**: Create in `src/components/`
3. **New API endpoints**: Extend the API client in `src/lib/api.ts`

## 📱 Mobile Support

The interface is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**:
   - Check that your backend is running
   - Verify the API endpoint URL
   - Ensure the API key is correct

2. **Build Errors**:
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for TypeScript errors: `npm run lint`

3. **Environment Variables**:
   - Make sure `.env.local` exists and contains the correct values
   - Restart the development server after changing environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Related Projects

- [cc-orchestrator1](../cc-orchestrator1): The backend API service
- [sales-intelligence-app-concept.md](../cc-orchestrator1/sales-intelligence-app-concept.md): Original concept document
