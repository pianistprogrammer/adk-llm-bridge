# SAP AI Core Integration Guide

This guide shows how to use adk-llm-bridge with SAP AI Core deployments.

## Overview

SAP AI Core is SAP's managed AI service that provides access to various LLM models through deployment-specific endpoints. The `adk-llm-bridge` library now supports SAP AI Core, allowing you to use Google ADK with models deployed on SAP AI Core.

## Prerequisites

Before using SAP AI Core with adk-llm-bridge, you need:

1. **SAP AI Core Account**: Access to SAP AI Core with proper permissions
2. **Deployed Model**: An LLM model deployment in SAP AI Core
3. **Authentication Credentials**:
   - Base URL for your SAP AI Core instance
   - Deployment ID for your LLM deployment
   - JWT Bearer token for authentication
   - AI Resource Group ID

## Quick Start

### Installation

```bash
npm install adk-llm-bridge @google/adk
# or
bun add adk-llm-bridge @google/adk
# or
pnpm add adk-llm-bridge @google/adk
```

### Basic Usage

```typescript
import { LlmAgent } from '@google/adk';
import { SAPAICore } from 'adk-llm-bridge';

const agent = new LlmAgent({
  name: 'assistant',
  model: SAPAICore('gpt-4.1', {
    baseURL: 'https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com',
    deploymentId: 'd6e93fe0efe29155',
    authToken: process.env.SAP_AI_CORE_AUTH_TOKEN,
    resourceGroup: '6a88fab9-904a-4ff2-a10c-6fd978fab614'
  }),
  instruction: 'You are a helpful assistant.',
});
```

## Configuration

### Environment Variables

Create a `.env` file with your SAP AI Core credentials:

```bash
SAP_AI_CORE_BASE_URL=https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com
SAP_AI_CORE_DEPLOYMENT_ID=d6e93fe0efe29155
SAP_AI_CORE_AUTH_TOKEN=eyJ0eXAiOiJKV1QiLCJqaWQi...
SAP_AI_CORE_RESOURCE_GROUP=6a88fab9-904a-4ff2-a10c-6fd978fab614
SAP_AI_CORE_API_VERSION=2024-02-15-preview  # optional
SAP_AI_CORE_MODEL=gpt-4.1                   # optional
```

Then use them in your code:

```typescript
import { SAPAICore } from 'adk-llm-bridge';

const model = SAPAICore(process.env.SAP_AI_CORE_MODEL!, {
  baseURL: process.env.SAP_AI_CORE_BASE_URL!,
  deploymentId: process.env.SAP_AI_CORE_DEPLOYMENT_ID!,
  authToken: process.env.SAP_AI_CORE_AUTH_TOKEN!,
  resourceGroup: process.env.SAP_AI_CORE_RESOURCE_GROUP!,
  apiVersion: process.env.SAP_AI_CORE_API_VERSION
});
```

### Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `baseURL` | `string` | ✅ | - | SAP AI Core API base URL |
| `deploymentId` | `string` | ✅ | - | Deployment ID for your LLM |
| `authToken` | `string` | ✅ | - | JWT Bearer token |
| `resourceGroup` | `string` | ✅ | - | AI Resource Group ID |
| `apiVersion` | `string` | ❌ | `"2024-02-15-preview"` | API version |
| `timeout` | `number` | ❌ | `60000` | Request timeout (ms) |
| `maxRetries` | `number` | ❌ | `2` | Max retry attempts |
| `headers` | `object` | ❌ | - | Additional HTTP headers |

## Examples

### Simple Chat

```typescript
import { LlmAgent } from '@google/adk';
import { SAPAICore } from 'adk-llm-bridge';

const agent = new LlmAgent({
  name: 'chatbot',
  model: SAPAICore('gpt-4.1', {
    baseURL: process.env.SAP_AI_CORE_BASE_URL!,
    deploymentId: process.env.SAP_AI_CORE_DEPLOYMENT_ID!,
    authToken: process.env.SAP_AI_CORE_AUTH_TOKEN!,
    resourceGroup: process.env.SAP_AI_CORE_RESOURCE_GROUP!
  }),
  instruction: 'You are a helpful assistant.',
});

// Use the agent
const response = await agent.run({ input: 'Hello!' });
console.log(response);
```

### With Tools

```typescript
import { FunctionTool, LlmAgent } from '@google/adk';
import { SAPAICore } from 'adk-llm-bridge';
import { z } from 'zod';

const getWeather = new FunctionTool({
  name: 'get_weather',
  description: 'Get current weather for a city',
  parameters: z.object({
    city: z.string().describe('City name'),
  }),
  execute: ({ city }) => {
    return { status: 'success', weather: 'sunny', city };
  },
});

const agent = new LlmAgent({
  name: 'weather-assistant',
  model: SAPAICore('gpt-4.1', {
    baseURL: process.env.SAP_AI_CORE_BASE_URL!,
    deploymentId: process.env.SAP_AI_CORE_DEPLOYMENT_ID!,
    authToken: process.env.SAP_AI_CORE_AUTH_TOKEN!,
    resourceGroup: process.env.SAP_AI_CORE_RESOURCE_GROUP!
  }),
  instruction: 'You help users check the weather.',
  tools: [getWeather],
});
```

### Multi-Agent System

```typescript
import { LlmAgent } from '@google/adk';
import { SAPAICore } from 'adk-llm-bridge';

// Create the model configuration once
const createModel = () => SAPAICore('gpt-4.1', {
  baseURL: process.env.SAP_AI_CORE_BASE_URL!,
  deploymentId: process.env.SAP_AI_CORE_DEPLOYMENT_ID!,
  authToken: process.env.SAP_AI_CORE_AUTH_TOKEN!,
  resourceGroup: process.env.SAP_AI_CORE_RESOURCE_GROUP!
});

// Specialist agent
const specialist = new LlmAgent({
  name: 'specialist',
  model: createModel(),
  description: 'Handles specialized tasks',
  instruction: 'You are a specialist assistant.',
});

// Coordinator agent
const coordinator = new LlmAgent({
  name: 'coordinator',
  model: createModel(),
  description: 'Routes requests to specialists',
  instruction: 'You coordinate tasks and delegate to specialists.',
  subAgents: [specialist],
});
```

### With Custom API Version

```typescript
import { SAPAICore } from 'adk-llm-bridge';

const model = SAPAICore('gpt-4.1', {
  baseURL: process.env.SAP_AI_CORE_BASE_URL!,
  deploymentId: process.env.SAP_AI_CORE_DEPLOYMENT_ID!,
  authToken: process.env.SAP_AI_CORE_AUTH_TOKEN!,
  resourceGroup: process.env.SAP_AI_CORE_RESOURCE_GROUP!,
  apiVersion: '2023-12-01-preview',  // Custom API version
  timeout: 120000,                     // 2 minutes timeout
  maxRetries: 5                        // Retry up to 5 times
});
```

## How It Works

The SAP AI Core provider:

1. **Constructs the endpoint URL** with the deployment ID:
   ```
   {baseURL}/v2/inference/deployments/{deploymentId}/chat/completions
   ```

2. **Adds query parameters**:
   ```
   ?api-version={apiVersion}
   ```

3. **Sets required headers**:
   - `AI-Resource-Group`: Your resource group ID
   - `Authorization`: Bearer token authentication
   - `Content-Type`: application/json

4. **Uses OpenAI-compatible format** for the request body (messages, tools, etc.)

## Troubleshooting

### Authentication Errors

If you get authentication errors:
- Verify your JWT token is valid and not expired
- Check that your token has the necessary permissions
- Ensure the resource group ID is correct

### 404 Not Found Errors

If you get 404 errors:
- Verify the deployment ID is correct
- Check that the base URL matches your SAP AI Core instance
- Ensure the deployment is active and running

### Timeout Errors

If requests timeout:
- Increase the `timeout` option (default is 60 seconds)
- Check your network connection to SAP AI Core
- Verify the SAP AI Core service is operational

## Advanced Usage

### Alternative Factory Function

You can also use the full configuration syntax:

```typescript
import { createSAPAICoreLlm } from 'adk-llm-bridge';

const llm = createSAPAICoreLlm({
  model: 'gpt-4.1',
  baseURL: process.env.SAP_AI_CORE_BASE_URL!,
  deploymentId: process.env.SAP_AI_CORE_DEPLOYMENT_ID!,
  authToken: process.env.SAP_AI_CORE_AUTH_TOKEN!,
  resourceGroup: process.env.SAP_AI_CORE_RESOURCE_GROUP!,
  apiVersion: '2024-02-15-preview'
});
```

### Direct Class Usage

For advanced use cases, you can use the class directly:

```typescript
import { SAPAICoreLlm } from 'adk-llm-bridge';

const llm = new SAPAICoreLlm({
  model: 'gpt-4.1',
  baseURL: process.env.SAP_AI_CORE_BASE_URL!,
  deploymentId: process.env.SAP_AI_CORE_DEPLOYMENT_ID!,
  authToken: process.env.SAP_AI_CORE_AUTH_TOKEN!,
  resourceGroup: process.env.SAP_AI_CORE_RESOURCE_GROUP!
});
```

## Complete Example

See the [basic-agent-sap-ai-core example](../examples/basic-agent-sap-ai-core/) for a complete, runnable example demonstrating:
- Environment-based configuration
- Multi-agent architecture
- Tool integration
- SAP BTP-specific use case (QA test case generation)

## Resources

- [SAP AI Core Documentation](https://help.sap.com/docs/sap-ai-core)
- [Google ADK Documentation](https://google.github.io/adk-docs/)
- [adk-llm-bridge GitHub](https://github.com/pianistprogrammer/adk-llm-bridge)
- [Example Project](../examples/basic-agent-sap-ai-core/)
