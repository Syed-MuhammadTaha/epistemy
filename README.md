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

## ⚖️ Trade-offs & Design Decisions

### ✅ Advantages
- **Rapid Development**: Monorepo structure enables fast iteration
- **Type Safety**: End-to-end TypeScript ensures robust data flow
- **Simplified Deployment**: Single application to deploy and maintain
- **Direct Integration**: No API layer reduces complexity and latency
- **Cost Effective**: Fewer services to manage and scale

### ⚠️ Trade-offs
- **Scalability Concerns**: Single service handles both UI and AI processing
- **Resource Coupling**: Heavy AI workloads can impact UI responsiveness  
- **Deployment Coupling**: UI and AI workflows deploy together
- **Limited Microservice Benefits**: Cannot scale components independently
- **Potential Memory Issues**: Large language model operations in same process as web server

### Known Gaps & Shortcuts
- **Authentication**: Hardcoded user IDs for development (no real auth system)
- **File Storage**: No actual file upload/storage implementation
- **Error Handling**: Limited error boundaries and fallback mechanisms
- **Performance**: No caching layer for AI workflow results
- **Testing**: Limited test coverage for AI workflows

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Local Development Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd epistemy
   pnpm install
   ```

2. **Start Development Servers**
   ```bash
   pnpm run dev
   ```

3. **Access the Application**
   - **Web Interface**: http://localhost:3000
   - **LangGraph Studio**: http://localhost:2024

### Available Routes
- `/` - Landing page
- `/tutor` - Tutor dashboard
- `/tutor/upload` - Session upload interface
- `/tutor/session/[id]` - Session editing
- `/student` - Student vault (session list)
- `/student/[id]` - Individual session view with quiz

## 📊 Evaluation & Observability

### LLM-as-a-Judge Evaluation Pipeline

Epistemy uses an intelligent evaluation system that compares session progress using structured analysis:

#### Evaluation Workflow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Session Data   │───▶│  Topic Extract  │───▶│  Progress Eval  │
│  - Transcript   │    │  - Current      │    │  - Continuity   │
│  - Previous     │    │  - Previous     │    │  - Difficulty   │
│  - Quiz Score   │    │  - Overlap      │    │  - Gaps         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
┌─────────────────┐    ┌─────────────────┐             │
│  Quiz Output    │◀───│  Quiz Generator │◀────────────┘
│  - Questions    │    │  - Adaptive     │
│  - Explanations │    │  - Difficulty   │
│  - Feedback     │    │  - Targeted     │
└─────────────────┘    └─────────────────┘
```

#### Evaluation Process

1. **Topic Extraction**
   - Extract main subject + subtopics from current session transcript
   - Extract topics from previous session for comparison
   - Identify knowledge continuity and progression

2. **Score Integration**  
   - Pull previous quiz performance (percentage score)
   - Map quiz topics to current session content
   - Use score to inform difficulty calibration

3. **Progress Analysis**
   ```json
   {
     "previous_topics": ["Linear Equations", "Fractions"],
     "previous_score": "72%", 
     "current_topics": ["Quadratic Equations", "Factorization"],
     "current_transcript": "...",
     "evaluation": {
       "continuity": "builds_upon",
       "difficulty_progression": "appropriate",
       "knowledge_gaps": ["fraction_to_decimal_conversion"]
     }
   }
   ```

4. **Adaptive Quiz Generation**
   - **High Previous Score** → Increase question difficulty
   - **Low Previous Score** → Reinforce fundamentals  
   - **Topic Overlap** → Bridge previous and current concepts
   - **New Topics** → Assess foundational understanding

#### Observability Features

**LangGraph Studio (Port 2024)**
- Real-time workflow execution tracing
- Step-by-step AI decision visualization  
- Performance metrics and timing analysis
- Input/output inspection for each workflow node
- Error tracking and debugging tools

**Progress Tracking**
- Session-to-session topic progression
- Quiz performance trends
- Knowledge gap identification
- Learning velocity measurement

#### Sample Evaluation Output

```
Progress Summary: Student demonstrated stronger understanding of 
algebra fundamentals (previous score: 72%) and successfully 
transitioned to quadratic equations. Current session reinforced 
factorization concepts while introducing polynomial operations.

Recommended Focus: Continue building on quadratic foundations 
while addressing identified gaps in fraction-decimal conversions.

Quiz Calibration: Moderate difficulty with 60% foundational 
questions, 40% application problems to assess concept transfer.
```

## 🛠️ Development Commands

```bash
# Install dependencies
pnpm install

# Start all development servers
pnpm run dev

# Build for production  
pnpm run build

# Run linting
pnpm run lint

# Run type checking
pnpm run type-check
```

## 📁 Project Structure

```
epistemy/
├── apps/
│   ├── web/                 # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/         # App router pages
│   │   │   ├── components/  # Reusable UI components  
│   │   │   └── lib/         # Utilities and data
│   │   └── package.json
│   └── agents/              # LangGraph.js workflows
│       ├── src/
│       │   └── react-agent/ # AI workflow definitions
│       └── package.json
├── package.json             # Root workspace configuration
├── pnpm-workspace.yaml      # Workspace definition
└── turbo.json              # Build pipeline configuration
```

---

Built with ❤️ using Next.js, LangGraph.js, and modern web technologies.