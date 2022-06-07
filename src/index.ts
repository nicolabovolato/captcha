import 'reflect-metadata'
import fastify from 'fastify'

import Pino, { Logger as PinoLogger } from 'pino'

import Captchas from './routes/captchas'
import Config, { parseConfig } from './config'

import { container } from 'tsyringe'
import RedisMap from './services/RedisMap'
import IMap from './services/IMap'
import Logger from './services/Logger'

const config = parseConfig()
const pino = Pino({ level: config.logLevel })

container.register<Config>(Config, { useValue: config })
container.register<PinoLogger>('PinoLogger', { useValue: pino })
container.register<Logger>(Logger, { useValue: new Logger(pino) })
container.register<IMap<string, string>>('IMap<string,string>', { useClass: RedisMap })

const server = fastify({ logger: pino })

server.register(Captchas)

server.listen(config.port, '0.0.0.0', (err) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
})
