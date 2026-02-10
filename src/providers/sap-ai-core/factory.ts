/**
 * @license
 * Copyright 2025 PAI
 * SPDX-License-Identifier: MIT
 */

/**
 * Factory functions for SAP AI Core LLM providers.
 *
 * @module providers/sap-ai-core/factory
 */

import type { SAPAICoreConfig } from "../../types";
import {
  SAPAICoreLlm,
  type SAPAICoreLlmProviderConfig,
} from "./sap-ai-core-llm";

/**
 * Creates an SAP AI Core LLM instance.
 *
 * This is the recommended way to connect to SAP AI Core deployments.
 * It provides a clean, functional API for configuring the provider.
 *
 * @param config - Configuration options including model, deployment details, and authentication
 * @returns A configured SAPAICoreLlm instance
 *
 * @example
 * ```typescript
 * // Basic usage
 * const llm = createSAPAICoreLlm({
 *   model: "gpt-4.1",
 *   baseURL: "https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com",
 *   deploymentId: "d6e93fe0efe29155",
 *   authToken: process.env.SAP_AUTH_TOKEN,
 *   resourceGroup: "6a88fab9-904a-4ff2-a10c-6fd978fab614"
 * });
 * ```
 *
 * @example
 * ```typescript
 * // With custom API version
 * const llm = createSAPAICoreLlm({
 *   model: "gpt-4.1",
 *   baseURL: "https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com",
 *   deploymentId: "d6e93fe0efe29155",
 *   authToken: process.env.SAP_AUTH_TOKEN,
 *   resourceGroup: "6a88fab9-904a-4ff2-a10c-6fd978fab614",
 *   apiVersion: "2024-02-15-preview"
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Use with ADK agent
 * import { LlmAgent } from "@google/adk";
 *
 * const agent = new LlmAgent({
 *   name: "assistant",
 *   model: createSAPAICoreLlm({
 *     model: "gpt-4.1",
 *     baseURL: "https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com",
 *     deploymentId: "d6e93fe0efe29155",
 *     authToken: process.env.SAP_AUTH_TOKEN,
 *     resourceGroup: "6a88fab9-904a-4ff2-a10c-6fd978fab614"
 *   }),
 *   instruction: "You are a helpful assistant."
 * });
 * ```
 *
 * @see {@link SAPAICoreLlm} for direct class usage
 * @see {@link SAPAICore} for a shorthand alias
 */
export function createSAPAICoreLlm(
  config: SAPAICoreLlmProviderConfig,
): SAPAICoreLlm {
  return new SAPAICoreLlm(config);
}

/**
 * Configuration options for the SAPAICore factory (model is specified separately).
 */
type SAPAICoreOptions = Omit<SAPAICoreConfig, "model"> & {
  /**
   * Base URL for the SAP AI Core API endpoint (required).
   */
  baseURL: string;

  /**
   * Deployment ID for the SAP AI Core deployment (required).
   */
  deploymentId: string;

  /**
   * Authorization bearer token (required).
   */
  authToken: string;

  /**
   * AI Resource Group ID (required).
   */
  resourceGroup: string;
};

/**
 * Creates an SAP AI Core LLM instance with a shorthand syntax.
 *
 * This is an alias for `createSAPAICoreLlm` that takes the model
 * as the first argument, similar to the `AIGateway` and `OpenRouter`
 * factory functions.
 *
 * @param model - The model identifier
 * @param options - Configuration options including deployment details and authentication
 * @returns A configured SAPAICoreLlm instance
 *
 * @example
 * ```typescript
 * // Simple usage
 * const llm = SAPAICore("gpt-4.1", {
 *   baseURL: "https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com",
 *   deploymentId: "d6e93fe0efe29155",
 *   authToken: process.env.SAP_AUTH_TOKEN,
 *   resourceGroup: "6a88fab9-904a-4ff2-a10c-6fd978fab614"
 * });
 * ```
 *
 * @example
 * ```typescript
 * // With optional settings
 * const llm = SAPAICore("gpt-4.1", {
 *   baseURL: "https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com",
 *   deploymentId: "d6e93fe0efe29155",
 *   authToken: process.env.SAP_AUTH_TOKEN,
 *   resourceGroup: "6a88fab9-904a-4ff2-a10c-6fd978fab614",
 *   apiVersion: "2024-02-15-preview",
 *   timeout: 120000
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Use with ADK agent
 * import { LlmAgent } from "@google/adk";
 *
 * const agent = new LlmAgent({
 *   name: "assistant",
 *   model: SAPAICore("gpt-4.1", {
 *     baseURL: process.env.SAP_BASE_URL,
 *     deploymentId: process.env.SAP_DEPLOYMENT_ID,
 *     authToken: process.env.SAP_AUTH_TOKEN,
 *     resourceGroup: process.env.SAP_RESOURCE_GROUP
 *   }),
 *   instruction: "You are a helpful assistant."
 * });
 * ```
 *
 * @see {@link createSAPAICoreLlm} for the full configuration syntax
 */
export function SAPAICore(
  model: string,
  options: SAPAICoreOptions,
): SAPAICoreLlm {
  return createSAPAICoreLlm({ model, ...options });
}
