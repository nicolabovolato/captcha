import dotenv from 'dotenv'
dotenv.config()

export default class Config {
    readonly redisUrl!: string
    readonly redisExpiry!: number
    readonly redisReconnectTimeout!: number
    readonly logLevel!: string
    readonly port!: number
}

export function parseConfig(): Config {
    return {
        redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
        redisExpiry: Number(process.env.REDIS_EXPIRY) || 15 * 60,
        redisReconnectTimeout: Number(process.env.REDIS_RECONNECT_TIMEOUT) || 5000,
        logLevel: process.env.LOG_LEVEL || 'info',
        port: Number(process.env.PORT) || 3000
    }
}
