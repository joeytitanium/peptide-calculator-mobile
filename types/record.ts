import type { UIMessage } from 'ai';

// Conversation record for homework help sessions
// Images are stored as base64 within the messages array
export type ChatRecord = {
  id: string;
  messages: UIMessage[];
  createdAt: Date;
};

// Helper to get the first image from a conversation (as base64 data URL)
export function getFirstImage(record: ChatRecord): string | undefined {
  for (const message of record.messages) {
    for (const part of message.parts) {
      if (
        part.type === 'file' &&
        'url' in part &&
        typeof part.url === 'string'
      ) {
        return part.url;
      }
    }
  }
  return undefined;
}

// Helper to get the first user text message from a conversation
export function getFirstUserMessage(record: ChatRecord): string | undefined {
  for (const message of record.messages) {
    if (message.role === 'user') {
      for (const part of message.parts) {
        if (part.type === 'text' && part.text) {
          return part.text;
        }
      }
    }
  }
  return undefined;
}

// Helper to get the first assistant text message from a conversation
export function getFirstAssistantMessage(
  record: ChatRecord
): string | undefined {
  for (const message of record.messages) {
    if (message.role === 'assistant') {
      for (const part of message.parts) {
        if (part.type === 'text' && part.text) {
          return part.text;
        }
      }
    }
  }
  return undefined;
}

// Helper to get message count
export function getMessageCount(record: ChatRecord): number {
  return record.messages.length;
}
