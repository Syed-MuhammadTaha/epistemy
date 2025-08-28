# Epistemy - AI-Powered Tutoring Platform

> An intelligent tutoring platform that leverages LangGraph.js workflows for session analysis, progress evaluation, and personalized quiz generation.

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 15 (React 19) with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI Workflows**: LangGraph.js for intelligent session processing
- **Monorepo**: Turborepo for efficient build and development
- **Package Manager**: pnpm for fast, space-efficient dependency management

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Epistemy Platform                        │
├─────────────────────────────────────────────────────────────┤
│  Next.js Frontend (Port 3000)                              │
│  ├── Tutor Dashboard                                        │
│  │   ├── Session Management                                 │
│  │   ├── Calendly Integration                               │
│  │   └── Content Upload                                     │
│  └── Student Portal                                         │
│      ├── Session Access                                     │
│      ├── Quiz Interface                                     │
│      └── Progress Tracking                                  │
├─────────────────────────────────────────────────────────────┤
│  LangGraph.js Workflows (Port 2024)                        │
│  ├── Session Analysis                                       │
│  ├── Progress Evaluation                                    │
│  ├── Quiz Generation                                        │
│  └── Topic Extraction                                       │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                 │
│  ├── User Management                                        │
│  ├── Session Storage                                        │
│  └── Quiz Attempts                                          │
└─────────────────────────────────────────────────────────────┘
```

### Direct Integration Approach

Epistemy uses **direct LangGraph.js integration** without separate API endpoints:
- **Simplified Architecture**: Workflows run directly within the Next.js application context
- **Type Safety**: Full TypeScript integration between frontend and AI workflows  
- **Real-time Processing**: Immediate access to workflow results without HTTP overhead
- **Development Efficiency**: Single codebase for UI and AI logic

### Trade-offs

**Benefits:**
- ✅ **Rapid Development**: No need to design and maintain separate API contracts
- ✅ **Type Safety**: Shared TypeScript definitions between UI and AI workflows
- ✅ **Simplified Deployment**: Single application to deploy and manage
- ✅ **Real-time Integration**: Direct access to workflow state and results

**Considerations:**
- ⚠️ **Scalability**: All processing happens in a single application context
- ⚠️ **Resource Management**: AI workflows and web server share the same resources
- ⚠️ **Service Separation**: Tighter coupling between frontend and AI logic

*Note: This approach is ideal for rapid prototyping and development. For production scale, consider separating AI workflows into dedicated services.*

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20.16.0 or higher
- **pnpm**: Latest version
- **Environment Variables**: Copy `.env.example` to `.env` and configure

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd epistemy_v2/epistemy

# Install dependencies
pnpm install

# Start development servers
pnpm run dev
```

### Development Servers

The `pnpm run dev` command starts both applications:

- **Web Application**: http://localhost:3000
  - Tutor dashboard and student portal
  - Session management and quiz interface
  
- **LangGraph Studio**: http://localhost:2024
  - Workflow visualization and debugging
  - Real-time execution tracing
  - Interactive workflow testing

## 🤖 AI Workflow System

### LLM-as-a-Judge Evaluation

Epistemy implements **LLM-as-a-Judge** for progress evaluation:

1. **Session Analysis**: AI analyzes tutoring session transcripts
2. **Progress Assessment**: Evaluates student understanding and engagement
3. **Personalized Feedback**: Generates specific recommendations for improvement
4. **Adaptive Questioning**: Creates targeted quiz questions based on identified gaps

### Workflow Pipeline

```
📝 Raw Transcript
    ↓
🧹 Clean & Normalize
    ↓  
📋 Extract Topics
    ↓
📊 Evaluate Progress  
    ↓
❓ Generate Quiz
    ↓
✅ Structured Output
```

### Observability & Tracing

- **LangGraph Studio**: Visual workflow execution and debugging at http://localhost:2024
- **Real-time Tracing**: Monitor AI decision-making process
- **Performance Metrics**: Track workflow execution times and success rates
- **Error Handling**: Comprehensive error logging and recovery mechanisms

## 📁 Project Structure

```
epistemy_v2/epistemy/
├── apps/
│   ├── web/                 # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/         # Next.js app router pages
│   │   │   ├── components/  # Reusable UI components  
│   │   │   └── lib/         # Utilities and data
│   │   └── package.json
│   └── agents/              # LangGraph.js workflows
│       ├── src/
│       │   └── agent/       # AI workflow definitions
│       │       ├── graph.ts        # Main workflow orchestration
│       │       ├── example.ts      # Usage examples
│       │       └── utils/          # Workflow utilities
│       │           ├── state.ts    # State & schema definitions
│       │           ├── prompts.ts  # AI prompt templates
│       │           ├── nodes.ts    # Workflow node implementations
│       │           └── index.ts    # Barrel exports
│       └── package.json
├── package.json             # Root workspace configuration
├── pnpm-workspace.yaml      # Workspace definition
└── turbo.json              # Build pipeline configuration
```

## 🎯 Key Features

### Tutor Dashboard
- **Session Creation**: Upload and process tutoring session content
- **Progress Tracking**: AI-generated student evaluations and feedback
- **Quiz Management**: Automated quiz generation with customizable questions
- **Calendly Integration**: Seamless scheduling integration

### Student Portal  
- **Session Access**: View processed session content and materials
- **Interactive Quizzes**: AI-generated questions with instant feedback
- **Progress Monitoring**: Track learning progress and achievements
- **Enrollment Management**: Secure session enrollment and payment handling

### AI Workflows
- **Transcript Processing**: Clean and normalize session recordings
- **Topic Extraction**: Identify key learning concepts automatically  
- **Progress Evaluation**: LLM-as-a-Judge assessment of student performance
- **Quiz Generation**: Create targeted questions based on session content

## 🔧 Development

### Running Tests
```bash
# Run all tests
pnpm run test

# Run tests for specific app
pnpm run test --filter=web
pnpm run test --filter=agents
```

### Building
```bash
# Build all applications
pnpm run build

# Build specific app
pnpm run build --filter=web
pnpm run build --filter=agents
```

### Linting
```bash
# Lint all code
pnpm run lint

# Fix linting issues
pnpm run lint:fix
```

## 📊 Evaluation & Observability

### LLM-as-a-Judge Implementation
- **Multi-criteria Assessment**: Evaluates comprehension, engagement, and progress
- **Contextual Feedback**: Provides specific, actionable recommendations
- **Adaptive Learning**: Adjusts difficulty based on student performance
- **Quality Assurance**: Validates AI-generated content for accuracy

### Monitoring & Debugging
- **LangGraph Studio**: Visual workflow execution at http://localhost:2024
- **Execution Tracing**: Step-by-step workflow monitoring
- **Performance Analytics**: Track processing times and success rates
- **Error Recovery**: Robust error handling and fallback mechanisms

---

**Built with ❤️ using Next.js, LangGraph.js, and modern AI workflows**