# CLARA: Connecting Local Agencies and Resources Automatically

CLARA is an innovative platform developed during the Llama Impact Hackathon that streamlines coordination between social service organizations and automates client support processes.

## 🎯 Problem Statement

In California alone:
- 16,465 Human Service Organizations struggle with coordinating care
- $21B is spent yearly on services
- 5M individuals and families need these services
- 49% of U.S. households receive some form of assistance annually
- Both providers and clients are overwhelmed by current systems
- High barriers exist in coordinating care between agencies

## 💡 Solution

CLARA automates and streamlines the social services coordination process through:

- **Daily/weekly AI phone call check-ins** with clients
- **Inter-service coordination** between different agencies
- **Resource access automation** to connect clients with required services
- **Historic tracking** of client interactions and progress
- **Efficient resource direction** for local agencies

## 🔧 Core Features

1. **Call Scheduling Interface**: Streamlined system for managing client communications
2. **Agentic Intake Flow**: Automated client intake process
3. **Provider Oversight**: Dashboard for mental health providers to track client progress
4. **Client-Facing Portal**: Easy-to-use interface for client interaction

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **UI Components**: Shadcn/ui
- **Charts & Visualization**: Recharts
- **Form Handling**: React Hook Form

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT, Auth0
- **API Documentation**: Swagger/OpenAPI

### AI/ML Components
- **LLM Integration**: OpenAI GPT-4
- **Voice Processing**: Whisper API
- **Text-to-Speech**: ElevenLabs API

### DevOps & Infrastructure
- **Cloud Platform**: AWS
- **Container Orchestration**: Docker & Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Datadog
- **Version Control**: Git & GitHub
- **API Gateway**: AWS API Gateway
- **Serverless Functions**: AWS Lambda

### Testing
- **Frontend Testing**: Jest, React Testing Library
- **Backend Testing**: Mocha, Chai
- **E2E Testing**: Cypress
- **API Testing**: Postman

### Security
- **SSL/TLS**: Let's Encrypt
- **API Security**: OAuth 2.0
- **Data Encryption**: AES-256
- **Compliance**: HIPAA, GDPR

## 👥 Team

- **Max**: Backend Development
- **Nitish**: API Development
- **Selali**: Application Development
- **Vikram**: Frontend Development

## 🎯 Impact

CLARA helps automate cumbersome processes for Human Service Organizations, making social services more accessible and effective for those who need them most. Our platform improves human-agent collaboration and ensures better service delivery to clients.

## 🚀 Vision

We aim to transform how people access vital community resources and services by breaking down coordination barriers between agencies, ensuring that no one falls through the cracks of the social support system.

## 🔗 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 14
- npm >= 9.0.0

### Installation

1. Clone the repository
```bash
git clone https://github.com/MaxDillon/LlamaSocialImpact.git
cd LlamaSocialImpact
npm install
npm run dev
