import IMap from './IMap'
import { inject, injectable } from 'tsyringe'
import { RedisClientType } from 'redis'
import Config from '../config'
import Logger from './Logger'

@injectable()
export default class RedisMap implements IMap<string, string> {

    private expiry: number

    public constructor(private logger: Logger, @inject('RedisClient') private client: RedisClientType, config: Config) {
        this.expiry = config.redisExpiry

        this.client.connect()
        this.client.on('error', (...args) => logger.error(args[0], args[1], ...args))
    }

    public async get(key: string): Promise<string | null> {
        return this.client.get(key)
    }

    public async set(key: string, value: string): Promise<void> {
        await this.client.set(key, value, { EX: this.expiry })
    }

}
