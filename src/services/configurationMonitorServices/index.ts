import { ExtensionContext, workspace } from "vscode";
import { createErrorNotification } from "@app/apis/node";
import { ManagedApiKey } from "./managedApiKey";

export function registerConfigurationMonitorService(
  _context: ExtensionContext
): void {
  try {
    const managedApiKeyInstance = ManagedApiKey.getInstance();
    const eventAffectsConfigurations = [
      "syntax-by-ai.serviceProvider",
      "syntax-by-ai.authentication",
      "syntax-by-ai.baseUrl",
      "syntax-by-ai.defaultModel",
      "syntax-by-ai.azureDeployment",
      "syntax-by-ai.azureApiVersion",
    ];

    workspace.onDidChangeConfiguration(async (event) => {
      try {
        if (
          eventAffectsConfigurations.some((config) =>
            event.affectsConfiguration(config)
          )
        ) {
          await managedApiKeyInstance.verify();
        }
      } catch (error) {
        createErrorNotification(error);
      }
    });
  } catch (error) {
    createErrorNotification(error);
  }
}
