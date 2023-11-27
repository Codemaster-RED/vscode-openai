import { env } from "vscode";
import { Command } from "../commandManager";
import { showMessageWithTimeout } from "@app/apis/vscode";
import { IChatCompletion } from "@app/types";

export default class ClipboardCopyMessagesMessageCommand implements Command {
  public readonly id = "_syntax-by-ai.messages.clipboard-copy.message";

  public execute(args: { data: IChatCompletion }) {
    const content = args.data.content;
    env.clipboard.writeText(content);
    showMessageWithTimeout(`Clipboard-Copy: ${content}`, 5000);
  }
}
