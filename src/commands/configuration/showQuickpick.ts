import { ExtensionContext } from "vscode";
import { Command } from "../commandManager";
import { ConfigurationQuickPickProvider } from "@app/providers";

export default class SettingsCommand implements Command {
  public readonly id = "syntax-by-ai.configuration.show.quickpick";
  private _configurationQuickPick: ConfigurationQuickPickProvider;
  public constructor(context: ExtensionContext) {
    this._configurationQuickPick =
      ConfigurationQuickPickProvider.getInstance(context);
  }

  public async execute() {
    this._configurationQuickPick.execute();
  }
}
