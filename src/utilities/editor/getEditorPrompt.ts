import { workspace } from "vscode";
import {
  getActiveTextEditorValue,
  getActiveTextLanguageId,
} from "@app/apis/vscode";

export const getEditorPrompt = async (
  configPrompt: string
): Promise<string | undefined> => {
  const language = getActiveTextLanguageId();
  const inputCode = getActiveTextEditorValue();

  let prompt = workspace
    .getConfiguration("syntax-by-ai")
    .get(configPrompt) as string;

  prompt = prompt.split("#{language}").join(language);
  prompt = prompt.split("#{source_code}").join(inputCode);
  return prompt;
};
