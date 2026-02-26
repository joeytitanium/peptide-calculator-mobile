type LogLevel = 'info' | 'error' | 'warn';

export const logApiError = ({
  message,
  error,
  request,
  context,
}: {
  message: string;
  request: Request;
  error?: unknown;
  context?: Record<string, unknown>;
}) => {
  console.error(
    `🚨 API Error  [${request.url}] message: ${message}`,
    'context:',
    context,
    'request:',
    request,
    'error:',
    error
  );
};

export const logMessage = ({
  message,
  level,
  request,
  context,
}: {
  message: string;
  level?: LogLevel;
  request?: Request;
  context?: Record<string, unknown>;
}) => {
  if (level === 'error') {
    console.error(
      `🚨 ERROR: ${message}`,
      JSON.stringify({ context, request }, null, '\t')
    );
    return;
  }

  if (level === 'info') {
    console.info(
      `ℹ INFO: ${message}`,
      JSON.stringify({ context, request }, null, '\t')
    );
  }

  if (level === 'warn') {
    console.warn(
      `⚠ WARN: ${message}`,
      JSON.stringify({ context, request }, null, '\t')
    );
  }

  console.log(
    `LOG: ${message}`,
    JSON.stringify({ context, request }, null, '\t')
  );
};

export const logDebugMessage = ({
  message,
  context,
}: {
  message: string;
  context?: Record<string, unknown>;
}) => {
  if (!__DEV__) return;

  console.info(`🟡 DEBUG: ${message}`);
  if (context) {
    console.info(JSON.stringify(context, null, 2));
  }
};

export const logError = ({
  message,
  error,
  context,
}: {
  message: string;
  error?: unknown;
  context?: Record<string, unknown>;
}) => {
  logMessage({
    message,
    context: {
      error,
      context,
    },
    level: 'error',
  });
};
