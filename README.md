# ManasMitra: An AI-Powered Mental Wellness Companion

ManasMitra is a confidential and empathetic mental wellness application designed to support users on their well-being journey. Powered by AI, it provides a safe space for self-reflection, personalized encouragement, and access to supportive resources.

## Key Features

- **Dashboard**: A welcoming home screen that provides a personalized greeting and AI-generated daily affirmations to start the day with positivity.
- **Daily Check-in**: An intuitive multi-step flow allowing users to log their mood and feelings, with AI-powered empathetic responses and personalized resource recommendations.
- **Progress Tracking**: Visual representation of mood trends over time with interactive charts, helping users recognize patterns and celebrate their wellness journey.
- **Mindfulness Hub**: Interactive mindfulness sessions including guided breathing exercises, meditation, body scan, and mindful moments with customizable durations and experience levels.
- **Resource Hub**: Curated collection of wellness articles, exercises, and guides covering meditation, breathing techniques, emotional awareness, and self-care strategies.
- **Anonymous Support Forum**: Safe and anonymous community space where users can share experiences, offer support, and connect with others facing similar challenges through posts and discussions.

## Tech Stack

This application is built with a modern, component-driven, and AI-first technology stack:

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) with App Router and Turbopack
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety
- **UI Library**: [React 18](https://react.dev/) with modern hooks
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- **Component Library**: [ShadCN UI](https://ui.shadcn.com/) with [Radix UI](https://www.radix-ui.com/) primitives
- **Icons**: [Lucide React](https://lucide.dev/) for consistent iconography
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth interactions
- **Charts**: [Recharts](https://recharts.org/) for data visualization

### AI & Backend
- **Generative AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini models
- **AI Flows**: Custom AI flows for daily affirmations, empathetic responses, contextual resource recommendations, and personalized mindfulness sessions
- **Validation**: [Zod](https://zod.dev/) for schema validation and type inference

### Development & Deployment
- **State Management**: React Hooks and Context API for client-side state
- **Data Persistence**: Browser Local Storage for user data persistence
- **Forms**: [React Hook Form](https://react-hook-form.com/) with resolver support
- **Development Tools**: Hot Module Replacement (HMR) with Turbopack
- **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting) ready configuration

## Project Structure

```
src/
├── ai/                    # AI flows and configurations
│   ├── genkit.ts         # Genkit AI configuration
│   ├── dev.ts            # Development AI setup
│   └── flows/            # AI flow definitions
├── app/                  # Next.js App Router pages
│   ├── page.tsx         # Dashboard/Home page
│   ├── check-in/        # Daily check-in feature
│   ├── forum/           # Anonymous support forum
│   ├── mindfulness/     # Mindfulness sessions
│   ├── progress/        # Progress tracking
│   └── resources/       # Wellness resources
├── components/          # Reusable React components
│   ├── ui/             # Base UI components (ShadCN)
│   ├── dashboard/      # Dashboard-specific components
│   ├── check-in/       # Check-in flow components
│   ├── forum/          # Forum-related components
│   ├── mindfulness/    # Mindfulness session components
│   ├── progress/       # Progress tracking components
│   └── layout/         # Layout components (sidebar, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utilities and type definitions
└── types.ts            # TypeScript type definitions
```

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn package manager

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up environment variables (if required):
```bash
cp .env.example .env.local
# Add your Firebase Genkit and Google AI credentials
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

### AI Development

For AI flow development and testing:
```bash
npm run genkit:dev    # Start Genkit development server
npm run genkit:watch  # Watch mode for AI flows
```

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit AI development environment
- `npm run genkit:watch` - Watch AI flows for changes

## Features in Detail

### AI-Powered Interactions
- **Daily Affirmations**: Personalized affirmations generated based on user mood
- **Empathetic Responses**: Context-aware responses to daily check-ins
- **Resource Recommendations**: AI suggests relevant wellness resources based on user input
- **Mindfulness Guidance**: Personalized session recommendations

### User Experience
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Accessibility**: Built with accessibility standards in mind
- **Smooth Animations**: Framer Motion powered interactions
- **Intuitive Navigation**: Clean and organized interface design

### Data & Privacy
- **Local Storage**: User data stored locally for privacy
- **Anonymous Forum**: Community features without personal identification
- **No User Registration**: Immediate access without account creation

## Development Status

This is a prototype application demonstrating AI-powered mental wellness features. The application showcases modern web development practices and AI integration patterns suitable for mental health applications.

## Contributing

This project follows modern React and Next.js development patterns. When contributing:
- Follow TypeScript best practices
- Use the established component structure
- Maintain accessibility standards


