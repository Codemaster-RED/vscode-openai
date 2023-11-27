import { EmbeddingTreeDataProvider } from "@app/providers";
import { Command } from "../commandManager";

export default class RefreshCommand implements Command {
  public readonly id = "_syntax-by-ai.embeddings.refresh";
  public constructor(private _instance: EmbeddingTreeDataProvider) {}

  public async execute() {
    this._instance.refresh();
  }
}
