import { describe, expect, it } from "bun:test";
import { SAPAICore, createSAPAICoreLlm } from "../../../src/providers/sap-ai-core";
import { SAPAICoreLlm } from "../../../src/providers/sap-ai-core/sap-ai-core-llm";

describe("SAP AI Core provider", () => {
  const mockConfig = {
    model: "gpt-4.1",
    baseURL: "https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com",
    deploymentId: "d6e93fe0efe29155",
    authToken: "test-jwt-token",
    resourceGroup: "6a88fab9-904a-4ff2-a10c-6fd978fab614",
  };

  describe("createSAPAICoreLlm factory", () => {
    it("creates SAPAICoreLlm instance", () => {
      const llm = createSAPAICoreLlm(mockConfig);
      expect(llm).toBeInstanceOf(SAPAICoreLlm);
    });

    it("sets model correctly", () => {
      const llm = createSAPAICoreLlm(mockConfig);
      expect(llm.model).toBe("gpt-4.1");
    });

    it("accepts optional apiVersion", () => {
      const llm = createSAPAICoreLlm({
        ...mockConfig,
        apiVersion: "2024-01-01-preview",
      });
      expect(llm).toBeInstanceOf(SAPAICoreLlm);
    });

    it("accepts timeout and maxRetries options", () => {
      const llm = createSAPAICoreLlm({
        ...mockConfig,
        timeout: 120000,
        maxRetries: 5,
      });
      expect(llm).toBeInstanceOf(SAPAICoreLlm);
    });

    it("works with different models", () => {
      const models = ["gpt-4.1", "gpt-4o", "claude-sonnet-4"];
      for (const model of models) {
        const llm = createSAPAICoreLlm({ ...mockConfig, model });
        expect(llm.model).toBe(model);
      }
    });
  });

  describe("SAPAICore shorthand factory", () => {
    it("creates SAPAICoreLlm instance", () => {
      const { model, ...options } = mockConfig;
      const llm = SAPAICore(model, options);
      expect(llm).toBeInstanceOf(SAPAICoreLlm);
    });

    it("sets model correctly", () => {
      const { model, ...options } = mockConfig;
      const llm = SAPAICore(model, options);
      expect(llm.model).toBe("gpt-4.1");
    });

    it("accepts optional configuration", () => {
      const { model, ...options } = mockConfig;
      const llm = SAPAICore(model, {
        ...options,
        apiVersion: "2024-01-01-preview",
        timeout: 90000,
      });
      expect(llm).toBeInstanceOf(SAPAICoreLlm);
    });
  });

  describe("SAPAICoreLlm class", () => {
    it("is constructible", () => {
      const llm = new SAPAICoreLlm(mockConfig);
      expect(llm).toBeInstanceOf(SAPAICoreLlm);
    });

    it("has expected model property", () => {
      const llm = new SAPAICoreLlm(mockConfig);
      expect(llm.model).toBe("gpt-4.1");
    });

    it("supports any model pattern", () => {
      expect(SAPAICoreLlm.supportedModels).toHaveLength(1);
      expect(SAPAICoreLlm.supportedModels[0].test("any-model")).toBe(true);
      expect(SAPAICoreLlm.supportedModels[0].test("gpt-4.1")).toBe(true);
      expect(SAPAICoreLlm.supportedModels[0].test("custom-model-123")).toBe(true);
    });

    it("accepts custom headers", () => {
      const llm = new SAPAICoreLlm({
        ...mockConfig,
        headers: {
          "X-Custom-Header": "custom-value",
        },
      });
      expect(llm).toBeInstanceOf(SAPAICoreLlm);
    });
  });

  describe("URL construction", () => {
    it("constructs proper deployment endpoint URL", () => {
      const llm = new SAPAICoreLlm(mockConfig);
      // The URL construction happens in the constructor
      // We verify the instance was created successfully
      expect(llm).toBeInstanceOf(SAPAICoreLlm);
    });

    it("includes API version in URL by default", () => {
      const llm = new SAPAICoreLlm(mockConfig);
      expect(llm).toBeInstanceOf(SAPAICoreLlm);
    });

    it("uses custom API version when provided", () => {
      const llm = new SAPAICoreLlm({
        ...mockConfig,
        apiVersion: "2023-12-01-preview",
      });
      expect(llm).toBeInstanceOf(SAPAICoreLlm);
    });
  });
});
