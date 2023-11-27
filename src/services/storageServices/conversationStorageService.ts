import { v4 as uuidv4 } from "uuid";
import { EventEmitter, Event, ExtensionContext } from "vscode";
import { GlobalStorageService } from "@app/apis/vscode";
import { IChatCompletion, IConversation, IPersonaOpenAI } from "@app/types";
import { MessageViewerPanel } from "@app/panels";
import {
  createDebugNotification,
  createErrorNotification,
} from "@app/apis/node";
import {
  VSCODE_OPENAI_CONVERSATION,
  VSCODE_OPENAI_EMBEDDING,
} from "@app/constants";
import { EmbeddingStorageService } from "..";

export default class ConversationStorageService {
  private static _emitterDidChange = new EventEmitter<void>();
  static readonly onDidChangeConversationStorage: Event<void> =
    this._emitterDidChange.event;

  private static _instance: ConversationStorageService;

  constructor(private _context: ExtensionContext) {}

  static init(context: ExtensionContext): void {
    try {
      ConversationStorageService.houseKeeping();
      ConversationStorageService._instance = new ConversationStorageService(
        context
      );
    } catch (error) {
      createErrorNotification(error);
    }
  }

  private static houseKeeping() {
    const keys = GlobalStorageService.instance.keys();
    keys.forEach((key) => {
      //Bugfix: 20230710 - Capture and remove all conversation bugs
      if (key == `${VSCODE_OPENAI_CONVERSATION.STORAGE_V1_ID}-undefined`) {
        GlobalStorageService.instance.deleteKey(key);
      }
    });
  }

  static get instance(): ConversationStorageService {
    return ConversationStorageService._instance;
  }

  public refresh() {
    ConversationStorageService._emitterDidChange.fire();
  }

  public getAll(): Array<IConversation> {
    const conversations: Array<IConversation> = [];
    const keys = GlobalStorageService.instance.keys();
    keys.forEach((key) => {
      // If conversation found then added to cache
      if (key.startsWith(`${VSCODE_OPENAI_CONVERSATION.STORAGE_V1_ID}-`)) {
        const conversation =
          GlobalStorageService.instance.getValue<IConversation>(key);
        if (conversation !== undefined) {
          conversations.push(conversation);
        }
      }
    });
    return conversations.sort((n1, n2) => n2.timestamp - n1.timestamp);
  }

  public show(conversationId: string) {
    const conversation = GlobalStorageService.instance.getValue<IConversation>(
      `${VSCODE_OPENAI_CONVERSATION.STORAGE_V1_ID}-${conversationId}`
    );
    if (conversation)
      MessageViewerPanel.render(this._context.extensionUri, conversation);
  }

  public deleteAll() {
    const keys = GlobalStorageService.instance.keys();
    keys.forEach((key) => {
      // If conversation found then added to cache
      if (key.startsWith(`${VSCODE_OPENAI_CONVERSATION.STORAGE_V1_ID}-`)) {
        const conversation =
          GlobalStorageService.instance.getValue<IConversation>(key);
        if (conversation !== undefined) {
          GlobalStorageService.instance.deleteKey(
            `${VSCODE_OPENAI_CONVERSATION.STORAGE_V1_ID}-${conversation.conversationId}`
          );
          createDebugNotification(
            `Deleting conversation: ${conversation.conversationId}`
          );
        }
      }
    });
    ConversationStorageService._emitterDidChange.fire();
  }

  public delete(key: string) {
    this._delete(key);
    ConversationStorageService._emitterDidChange.fire();
  }

  private _delete(key: string) {
    GlobalStorageService.instance.deleteKey(
      `${VSCODE_OPENAI_CONVERSATION.STORAGE_V1_ID}-${key}`
    );
  }

  public update(conversation: IConversation) {
    this._update(conversation);
    ConversationStorageService._emitterDidChange.fire();
  }

  private _update(conversation: IConversation) {
    this._delete(conversation.conversationId);
    GlobalStorageService.instance.setValue<IConversation>(
      `${VSCODE_OPENAI_CONVERSATION.STORAGE_V1_ID}-${conversation.conversationId}`,
      conversation
    );
  }

  public async create(
    persona: IPersonaOpenAI,
    embeddingId?: string
  ): Promise<IConversation> {
    const uuid4 = uuidv4();

    let welcomeMessage = "";
    let summary = "<New Conversation>";

    if (embeddingId) {
      welcomeMessage = await this.getEmbeddingWelcomeMessage(embeddingId);

      const embeddingSummary = await this.getEmbeddingSummary(embeddingId);
      summary = `Query ${embeddingSummary.toUpperCase()}`;
    } else welcomeMessage = await this.getWelcomeMessage();

    const chatCompletion: IChatCompletion[] = [];
    chatCompletion.push({
      content: welcomeMessage,
      author: `${persona.roleName} (${persona.configuration.service})`,
      timestamp: new Date().toLocaleString(),
      mine: false,
      completionTokens: 0,
      promptTokens: 0,
      totalTokens: 0,
    });

    const conversation: IConversation = {
      timestamp: new Date().getTime(),
      conversationId: uuid4,
      persona: persona,
      embeddingId: embeddingId,
      summary: summary,
      chatMessages: chatCompletion,
    };
    return conversation;
  }

  private async getWelcomeMessage(): Promise<string> {
    return `Welcome! I'm syntax-by-ai, an AI language model based on OpenAI. I have been designed to assist you with all your technology needs. Whether you're looking for help with programming, troubleshooting technical issues, or just want to stay up-to-date with the latest developments in the industry, I'm here to provide the information you need.`;
  }
  private async getEmbeddingWelcomeMessage(
    embeddingId: string
  ): Promise<string> {
    let content =
      "Welcome to resource query. This conversation will be scoped to the following resources";

    // If we use the "special key" we're using all resources
    if (embeddingId === VSCODE_OPENAI_EMBEDDING.RESOURCE_QUERY_ALL) {
      const allEmbeddings = (
        await EmbeddingStorageService.instance.getAll()
      ).map((embedding) => {
        return embedding.name;
      });
      content = content + `\n- ${allEmbeddings.join("\n- ")}`;
    } else {
      const embedding = await EmbeddingStorageService.instance.get(embeddingId);
      content = content + `\n- ${embedding?.name}`;
    }
    return content;
  }

  private async getEmbeddingSummary(embeddingId: string): Promise<string> {
    if (embeddingId === VSCODE_OPENAI_EMBEDDING.RESOURCE_QUERY_ALL) {
      return "all-resources";
    } else {
      const embedding = await EmbeddingStorageService.instance.get(embeddingId);
      return embedding?.name ?? "";
    }
  }
}
