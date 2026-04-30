# 📝 Pino Logger Module

## 📌 Overview

The `PinoLoggerModule` is a centralized logging module for the application, leveraging **Pino** as the logging library.
This module ensures structured and efficient logging, supports different logging levels, and integrates seamlessly with
the application.

## 📂 Module Structure

- **`pino-logger.service.ts`**: Contains the `PinoLoggerService`, responsible for handling log messages.
- **`pino.module.ts`**: Defines the `PinoModule`, which registers and provides `PinoLoggerService` globally.

## ⚙️ Configuration

The module fetches configuration values from `ConfigService`, which loads environment variables. The key configuration
options include:

- **`logLevel`**: Defines the logging level (trace, debug, info, warn, error, fatal).
- **`nodeEnv`**: Determines whether logs should be formatted for development (`pino-pretty`).

## 📜 Methods

The `PinoLoggerService` provides the following methods for logging:

- **`log(message: string, context?: string)`** → Logs an informational message.
- **`error(message: string, trace?: string, context?: string)`** → Logs an error with optional stack trace.
- **`warn(message: string, context?: string)`** → Logs a warning message.
- **`debug(message: string, context?: string)`** → Logs a debug-level message.

### Example Usage:

```typescript
import { PinoLoggerService } from "./pino-logger.service";

constructor(private
readonly
logger: PinoLoggerService
)
{
}

this.logger.log("Application started", "Bootstrap");
this.logger.error("Unexpected error occurred", "StackTrace", "ServiceX");
```

## ✅ Key Benefits

✔ **Lightweight & Fast**: Optimized for high-performance logging.  
✔ **Supports Multiple Levels**: Fine-grained control over logging verbosity.  
✔ **Easily Configurable**: Integrates with environment variables.  
✔ **Developer-Friendly**: Pretty-print logs in development mode.

## 🛠️ Testing

The module is fully tested with Jest, using mock implementations of `pino` to ensure proper logging behavior without
affecting performance.

```typescript
test("should log an info message", () => {
  logger.log("Test message", "TestContext");
  expect(mockPino.info).toHaveBeenCalledWith({ context: "TestContext", message: "Test message" });
});
```

---

🚀 **This module ensures efficient and structured logging throughout the application, making debugging and monitoring
easier.**

