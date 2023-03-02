import { getActiveTextEditorValue } from '../../utils/getActiveTextEditorValue'
import { getActiveTextLanguageId } from '../../utils/getActiveTextLanguageId'

export async function commentPrompt(): Promise<string> {
  const language = getActiveTextLanguageId()
  const inputCode = getActiveTextEditorValue()

  const persona = `Act like a programming expert in ${language}.\n`
  const request = `Given the following code, add comments to explain any complex logic:\n`
  const sourceCode = `\n${inputCode}\n\n`
  const rules = `Add a comment next to each line that requires an explanation. Only add comments if the code is complex enough to require an explanation. The prompt should only return the original code with the comments included.\n`
  const prompt = persona.concat(request, sourceCode, rules)
  return prompt
}
