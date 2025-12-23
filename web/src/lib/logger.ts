import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'logs');
const ERROR_LOG_PATH = path.join(LOG_DIR, 'error.log');
const INFO_LOG_PATH = path.join(LOG_DIR, 'info.log');

/**
 * Ensures the log directory exists.
 */
function ensureLogDir() {
    if (!fs.existsSync(LOG_DIR)) {
        try {
            fs.mkdirSync(LOG_DIR, { recursive: true });
        } catch (error) {
            console.error('Failed to create log directory:', error);
        }
    }
}

/**
 * Formats the log entry.
 */
function formatLogEntry(level: 'ERROR' | 'INFO', message: string, context?: string, error?: unknown): string {
    const timestamp = new Date().toISOString();
    let logContent = `[${timestamp}] [${level}] [${context || 'General'}] ${message}`;

    if (error) {
        if (error instanceof Error) {
            logContent += `\nError: ${error.message}\nStack: ${error.stack}`;
        } else {
            logContent += `\nError: ${String(error)}`;
        }
    }

    logContent += '\n----------------------------------------\n';
    return logContent;
}

/**
 * Logs an error to the error log file and console.
 */
export function logError(message: string, context?: string, error?: unknown) {
    const entry = formatLogEntry('ERROR', message, context, error);

    // Always log to console
    console.error(entry);

    ensureLogDir();

    try {
        fs.appendFileSync(ERROR_LOG_PATH, entry);
    } catch (fsError) {
        console.error('Failed to write to error log file:', fsError);
    }
}

/**
 * Logs info to the info log file and console.
 */
export function logInfo(message: string, context?: string) {
    const entry = formatLogEntry('INFO', message, context);

    // Log to console
    console.log(entry);

    ensureLogDir();

    try {
        fs.appendFileSync(INFO_LOG_PATH, entry);
    } catch (fsError) {
        console.error('Failed to write to info log file:', fsError);
    }
}
