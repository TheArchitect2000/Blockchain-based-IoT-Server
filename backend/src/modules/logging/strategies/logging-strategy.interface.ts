export interface LoggingStrategyInterface {
  log(message: string, userId?: string): void;
}
