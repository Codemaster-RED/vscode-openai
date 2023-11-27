import { commands } from "vscode";
import { Command } from "../commandManager";

export default class SettingsCommand implements Command {
  public readonly id = "_syntax-by-ai.editor.settings";

  public async execute() {
    commands.executeCommand(
      "workbench.action.openSettings",
      "syntax-by-ai.editor.code"
    );
  }
}
