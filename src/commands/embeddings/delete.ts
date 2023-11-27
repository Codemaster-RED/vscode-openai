import { window } from "vscode";
import { EmbeddingTreeDataProvider, EmbeddingTreeItem } from "@app/providers";
import { Command } from "../commandManager";
import { EmbeddingStorageService } from "@app/services";

export default class RefreshCommand implements Command {
  public readonly id = "_syntax-by-ai.embeddings.delete.resource";
  public constructor(private _instance: EmbeddingTreeDataProvider) {}

  public async execute(node: EmbeddingTreeItem) {
    window
      .showInformationMessage(
        "Are you sure you want to delete this embedding?",
        "Yes",
        "No"
      )
      .then((answer) => {
        if (answer === "Yes") {
          EmbeddingStorageService.instance.delete(node.embeddingId);
          this._instance.refresh();
        }
      });
  }
}
