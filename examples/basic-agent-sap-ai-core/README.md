# Basic Agent - SAP AI Core

This example demonstrates how to use **adk-llm-bridge** with **SAP AI Core** to create a multi-agent system for SAP BTP QA test case generation.

## What it does

This example creates a help desk-style agent system specialized for SAP Business Technology Platform (SAP BTP) testing:

- **Test Coordinator**: Routes requests and coordinates test case generation
- **SAP QA Engineer**: Generates comprehensive test cases for SAP BTP solutions including:
  - SAP Fiori/UI5 applications
  - ABAP custom logic on SAP BTP ABAP Environment
  - SAP Integration Suite and Extension Suite services
  - SAP S/4HANA integrations
  - SAP Identity service authorizations

## Prerequisites

1. **SAP AI Core Account**: You need access to SAP AI Core with a deployed LLM model
2. **Deployment Details**: You'll need:
   - Base URL for your SAP AI Core instance
   - Deployment ID for your LLM deployment
   - Authorization bearer token (JWT)
   - AI Resource Group ID
   - API version (optional, defaults to "2024-02-15-preview")

## Setup

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env`** with your SAP AI Core credentials:
   ```bash
   SAP_AI_CORE_BASE_URL=https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com
   SAP_AI_CORE_DEPLOYMENT_ID=your-deployment-id
   SAP_AI_CORE_AUTH_TOKEN=your-jwt-token
   SAP_AI_CORE_RESOURCE_GROUP=your-resource-group-id
   SAP_AI_CORE_API_VERSION=2024-02-15-preview
   SAP_AI_CORE_MODEL=gpt-4.1
   ```

## Running the Example

### Option 1: Interactive Web UI (Recommended)

```bash
bun run web
```

Then open your browser to `http://localhost:3333` and interact with the agents through the ADK DevTools UI.

### Option 2: Command Line

```bash
bun run dev
```

## Example Queries

Try these prompts in the web UI or CLI:

1. **Test Case Generation**:
   - "Generate test cases for a Fiori app that manages purchase orders on SAP BTP"
   - "Create test cases for ABAP custom logic that validates invoice data"
   - "I need test cases for an Integration Suite flow that connects to S/4HANA"

2. **Specific Scenarios**:
   - "Generate 5 test cases for user authentication in a SAP BTP Fiori application"
   - "Create test cases for authorization checks in SAP Identity Service"

## How It Works

### SAP AI Core Configuration

The example uses the `SAPAICore` factory function from `adk-llm-bridge`:

```typescript
import { SAPAICore } from "adk-llm-bridge";

const model = SAPAICore("gpt-4.1", {
  baseURL: "https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com",
  deploymentId: "d6e93fe0efe29155",
  authToken: process.env.SAP_AI_CORE_AUTH_TOKEN,
  resourceGroup: "6a88fab9-904a-4ff2-a10c-6fd978fab614",
  apiVersion: "2024-02-15-preview" // optional
});
```

### Multi-Agent Architecture

The system uses ADK's multi-agent capabilities:

1. **Root Agent** (Test Coordinator):
   - Understands user requirements
   - Gathers necessary context about SAP BTP components
   - Routes to appropriate specialist

2. **Sub-Agent** (SAP QA Engineer):
   - Generates detailed test cases
   - Includes SAP BTP-specific considerations
   - Creates Jira XRay-compatible JSON output

### Tools

The QA Engineer has access to:
- `generate_test_cases`: Creates comprehensive test cases with SAP BTP context

## Project Structure

```
basic-agent-sap-ai-core/
├── agent.ts          # Agent definitions and configuration
├── package.json      # Dependencies
├── .env.example      # Example environment variables
└── README.md         # This file
```

## Learn More

- [SAP AI Core Documentation](https://help.sap.com/docs/sap-ai-core)
- [Google ADK Documentation](https://google.github.io/adk-docs/)
- [adk-llm-bridge GitHub](https://github.com/pianistprogrammer/adk-llm-bridge)
