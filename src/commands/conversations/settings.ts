import { commands } from "vscode";
import { Command } from "../commandManager";

export default class SettingsConversationsCommand implements Command {
  public readonly id = "_syntax-by-ai.conversations.settings";

  public async execute() {
    commands.executeCommand(
      "workbench.action.openSettings",
      "syntax-by-ai.conversation-configuration"
    );
  }
}
