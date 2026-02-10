/**
 * @license
 * Copyright 2025 PAI
 * SPDX-License-Identifier: MIT
 */

/**
 * SAP AI Core LLM provider for ADK.
 *
 * This module provides support for connecting to SAP AI Core managed LLM deployments.
 * SAP AI Core is SAP's managed AI service that provides access to various LLM models
 * through deployment-specific endpoints.
 *
 * ## Quick Start
 *
 * ```typescript
 * import { createSAPAICoreLlm, SAPAICore } from "adk-llm-bridge";
 *
 * // Full configuration
 * const llm = createSAPAICoreLlm({
 *   model: "gpt-4.1",
 *   baseURL: "https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com",
 *   deploymentId: "d6e93fe0efe29155",
 *   authToken: process.env.SAP_AUTH_TOKEN,
 *   resourceGroup: "6a88fab9-904a-4ff2-a10c-6fd978fab614"
 * });
 *
 * // Shorthand syntax
 * const llm2 = SAPAICore("gpt-4.1", {
 *   baseURL: "https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com",
 *   deploymentId: "d6e93fe0efe29155",
 *   authToken: process.env.SAP_AUTH_TOKEN,
 *   resourceGroup: "6a88fab9-904a-4ff2-a10c-6fd978fab614"
 * });
 * ```
 *
 * @module providers/sap-ai-core
 */

export {
  SAPAICoreLlm,
  type SAPAICoreLlmProviderConfig,
} from "./sap-ai-core-llm";
export { SAPAICore, createSAPAICoreLlm } from "./factory";
