/**
 * @license
 * Copyright 2025 PAI
 * SPDX-License-Identifier: MIT
 */

/**
 * SAP AI Core LLM provider implementation.
 *
 * This module provides an LLM class for connecting to SAP AI Core deployments.
 * SAP AI Core requires specific headers (AI-Resource-Group, Authorization) and
 * supports deployment-specific endpoints with API version parameters.
 *
 * @module providers/sap-ai-core/sap-ai-core-llm
 */

import { DEFAULT_MAX_RETRIES, DEFAULT_TIMEOUT } from "../../constants";
import { OpenAICompatibleLlm } from "../../core/openai-compatible-llm";
import type { SAPAICoreConfig } from "../../types";

/**
 * Configuration type with required fields for SAP AI Core.
 */
export type SAPAICoreLlmProviderConfig = SAPAICoreConfig & {
  /**
   * Base URL for the SAP AI Core API endpoint (required).
   *
   * @example "https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com"
   */
  baseURL: string;

  /**
   * Deployment ID for the SAP AI Core deployment (required).
   *
   * @example "d6e93fe0efe29155"
   */
  deploymentId: string;

  /**
   * Authorization bearer token (required).
   *
   * @example "eyJ0eXAiOiJKV1QiLCJqaWQi..."
   */
  authToken: string;

  /**
   * AI Resource Group ID (required).
   *
   * @example "6a88fab9-904a-4ff2-a10c-6fd978fab614"
   */
  resourceGroup: string;
};

/**
 * LLM implementation for SAP AI Core deployments.
 *
 * This provider allows connecting to SAP AI Core managed LLM deployments.
 * It handles the specific authentication and configuration requirements
 * of SAP AI Core, including:
 *
 * - Custom headers: `AI-Resource-Group` and `Authorization`
 * - Deployment-specific endpoints
 * - API version query parameters
 *
 * @example
 * ```typescript
 * const llm = new SAPAICoreLlm({
 *   model: "gpt-4.1",
 *   baseURL: "https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com",
 *   deploymentId: "d6e93fe0efe29155",
 *   authToken: process.env.SAP_AUTH_TOKEN,
 *   resourceGroup: "6a88fab9-904a-4ff2-a10c-6fd978fab614",
 *   apiVersion: "2024-02-15-preview" // optional, defaults to "2024-02-15-preview"
 * });
 * ```
 *
 * @see {@link createSAPAICoreLlm} for the factory function
 * @see {@link SAPAICore} for the shorthand alias
 */
export class SAPAICoreLlm extends OpenAICompatibleLlm {
  /**
   * Model patterns supported by this provider.
   *
   * Accepts any model identifier since SAP AI Core can host various models.
   *
   * @static
   */
  static readonly supportedModels = [/.*/];

  /**
   * Creates a new SAP AI Core LLM provider instance.
   *
   * @param config - Configuration options including model, deployment details, and authentication
   *
   * @example
   * ```typescript
   * const llm = new SAPAICoreLlm({
   *   model: "gpt-4.1",
   *   baseURL: "https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com",
   *   deploymentId: "d6e93fe0efe29155",
   *   authToken: process.env.SAP_AUTH_TOKEN,
   *   resourceGroup: "6a88fab9-904a-4ff2-a10c-6fd978fab614"
   * });
   * ```
   */
  constructor(config: SAPAICoreLlmProviderConfig) {
    // Build the deployment-specific URL
    const apiVersion = config.apiVersion ?? "2024-02-15-preview";
    const deploymentPath = `/v2/inference/deployments/${config.deploymentId}/chat/completions`;
    
    // Construct the full URL with query parameters
    const url = new URL(deploymentPath, config.baseURL);
    url.searchParams.set("api-version", apiVersion);
    const finalBaseURL = url.toString();

    // Build headers with SAP-specific requirements
    const headers: Record<string, string> = {
      "AI-Resource-Group": config.resourceGroup,
      Authorization: `Bearer ${config.authToken}`,
      "Content-Type": "application/json",
    };

    // Add any additional headers from config
    if (config.headers) {
      Object.assign(headers, config.headers);
    }

    super(config, {
      baseURL: finalBaseURL,
      apiKey: "", // Not used for SAP AI Core, authentication is via Bearer token
      timeout: config.timeout ?? DEFAULT_TIMEOUT,
      maxRetries: config.maxRetries ?? DEFAULT_MAX_RETRIES,
      defaultHeaders: headers,
    });
  }

  /**
   * Returns the error prefix for this provider.
   *
   * @returns "SAP_AI_CORE"
   * @protected
   */
  protected getErrorPrefix(): string {
    return "SAP_AI_CORE";
  }

  /**
   * Returns provider-specific options to include in requests.
   *
   * @returns The configured provider options or an empty object
   * @protected
   */
  protected getProviderRequestOptions(): Record<string, unknown> {
    return {};
  }
}
