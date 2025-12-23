import { SquareClient, SquareEnvironment } from 'square';

if (!process.env.SQUARE_ACCESS_TOKEN) {
    throw new Error('SQUARE_ACCESS_TOKEN is missing');
}

const env = process.env.SQUARE_ENV || process.env.SQUARE_ENVIRONMENT;
export const square = new SquareClient({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    bearerAuthCredentials: {
        accessToken: process.env.SQUARE_ACCESS_TOKEN,
    },
    environment: env === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
} as any);
