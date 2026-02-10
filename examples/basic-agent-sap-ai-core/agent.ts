import { FunctionTool, LlmAgent } from "@google/adk";
import { SAPAICore } from "adk-llm-bridge";
import { z } from "zod";

// =============================================================================
// Test Cases Tool for SAP QA
// =============================================================================

const generateTestCases = new FunctionTool({
  name: "generate_test_cases",
  description:
    "Generate comprehensive test cases for SAP BTP solutions including Fiori apps, ABAP logic, and Integration Suite services.",
  parameters: z.object({
    issueDescription: z
      .string()
      .describe("Description of the SAP BTP issue or feature"),
    componentType: z
      .enum(["fiori", "abap", "integration", "extension", "general"])
      .describe("Type of SAP BTP component"),
  }),
  execute: ({ issueDescription, componentType }) => {
    return {
      status: "success",
      testCases: [
        {
          id: "TC-001",
          title: `Verify ${componentType} functionality for: ${issueDescription}`,
          preconditions: [
            "User has appropriate SAP BTP role assignments",
            "SAP BTP subaccount is configured correctly",
          ],
          steps: [
            {
              action: "Navigate to SAP BTP cockpit",
              data: "Navigate to the appropriate subaccount",
              result: "SAP BTP cockpit loads successfully",
            },
            {
              action: "Access the application/service",
              data: `Open ${componentType} component`,
              result: "Component loads without errors",
            },
            {
              action: "Execute primary functionality",
              data: issueDescription,
              result: "Expected behavior is observed",
            },
          ],
        },
      ],
    };
  },
});

// =============================================================================
// SAP QA Agent
// =============================================================================

const qaAgent = new LlmAgent({
  name: "SAP_QA_Engineer",
  model: SAPAICore(process.env.SAP_AI_CORE_MODEL || "gpt-4.1", {
    baseURL:
      process.env.SAP_AI_CORE_BASE_URL ||
      "https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com",
    deploymentId: process.env.SAP_AI_CORE_DEPLOYMENT_ID || "",
    authToken: process.env.SAP_AI_CORE_AUTH_TOKEN || "",
    resourceGroup: process.env.SAP_AI_CORE_RESOURCE_GROUP || "",
    apiVersion: process.env.SAP_AI_CORE_API_VERSION || "2024-02-15-preview",
  }),
  description:
    "Senior QA engineer specializing in SAP BTP solutions, creating comprehensive test cases for Jira XRay.",
  instruction: `You are a senior QA engineer specializing in creating comprehensive test cases for Jira XRay, specifically for solutions on SAP Business Technology Platform (SAP BTP). This may include:

- SAP Fiori/UI5 applications running on BTP
- Custom ABAP logic on SAP BTP ABAP Environment
- Services from SAP Integration Suite and SAP Extension Suite
- On-premise or cloud-based SAP S/4HANA integrations
- Authorization/user roles managed via SAP Identity services

Your task:
1. Analyze the issue description and related context
2. Generate comprehensive test scenarios with SAP BTP-specific details
3. Create valid XRAY JSON format with:
   - "steps" field containing an array of test steps
   - Each step must have: "action" (string), "data" (string), "result" (string)
4. Include SAP-specific considerations (service names, subaccount, Fiori app names)
5. Return ONLY JSON, no markdown formatting or explanations

Be thorough and include edge cases, SAP BTP integration points, and authorization checks.`,
  tools: [generateTestCases],
});

// =============================================================================
// Root Agent (Coordinator)
// =============================================================================

export const rootAgent = new LlmAgent({
  name: "SAP_Test_Coordinator",
  model: SAPAICore(process.env.SAP_AI_CORE_MODEL || "gpt-4.1", {
    baseURL:
      process.env.SAP_AI_CORE_BASE_URL ||
      "https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com",
    deploymentId: process.env.SAP_AI_CORE_DEPLOYMENT_ID || "",
    authToken: process.env.SAP_AI_CORE_AUTH_TOKEN || "",
    resourceGroup: process.env.SAP_AI_CORE_RESOURCE_GROUP || "",
    apiVersion: process.env.SAP_AI_CORE_API_VERSION || "2024-02-15-preview",
  }),
  description:
    "Coordinates SAP BTP test case generation and delegates to QA specialists.",
  instruction: `You are a test coordination assistant for SAP BTP projects. Your role is to:

1. Understand the user's testing requirements for SAP BTP solutions
2. Gather necessary context about:
   - The SAP BTP component type (Fiori, ABAP, Integration, etc.)
   - Issue description or feature requirements
   - Related Jira issues or context
3. Delegate to the SAP QA Engineer for detailed test case generation
4. Present the results in a clear, organized format

Be professional and ensure all SAP BTP-specific details are captured.`,
  subAgents: [qaAgent],
});
