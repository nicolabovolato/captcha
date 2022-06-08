import fastify, { FastifyInstance } from 'fastify'

import Pino, { Logger as PinoLogger } from 'pino'

import Captchas from './routes/captchas'
import Config, { parseConfig } from './config'

import { container } from 'tsyringe'
import RedisMap from './services/RedisMap'
import IMap from './services/IMap'
import Logger from './services/Logger'
import { createClient } from 'redis'
import { RedisClientType } from '@redis/client'

export function configure() {
    const config = parseConfig()
    const pino = Pino({ level: config.logLevel })
    const redisClient: RedisClientType = createClient({
        url: config.redisUrl,
        socket: {
            reconnectStrategy: _ => config.redisReconnectTimeout
        },
        disableOfflineQueue: true
    })

    container.register<Config>(Config, { useValue: config })
    container.register<PinoLogger>('PinoLogger', { useValue: pino })
    container.register<Logger>(Logger, { useValue: new Logger(pino) })
    container.register<RedisClientType>('RedisClient', { useValue: redisClient })
    container.register<IMap<string, string>>('IMap<string,string>', { useClass: RedisMap })
}

export function build(): FastifyInstance {
    const pino: PinoLogger = container.resolve('PinoLogger')

    const server = fastify({ logger: pino })

    server.register(Captchas, { prefix: '/v1' })

    return server
}
