import pino from 'pino'
import RedisMap from '../src/services/RedisMap'
import Logger from '../src/services/Logger'
import Config from '../src/config'

describe('RedisMap', () => {

    const redisMock: any = {
        connect: jest.fn(),
        on: jest.fn(),
        get: jest.fn(),
        set: jest.fn()
    }

    const config: Config = {
        redisUrl: 'redis://localhost:6379',
        redisExpiry: 1000,
        redisReconnectTimeout: 5000,
        logLevel: '',
        port: 0,
        corsOrigin: false
    }

    const logger = new Logger(pino({ level: 'silent' }))
    const service = new RedisMap(logger, redisMock, config)

    describe('constructor()', () => {

        it('calls RedisClientType.connect()', () => {
            redisMock.connect = jest.fn()
            new RedisMap(logger, redisMock, config)
            expect(redisMock.connect).toHaveBeenCalledTimes(1)
        })

    })

    describe('get()', () => {

        it('calls redis.get() with correct parameters', async () => {
            redisMock.get = jest.fn()
            const key = 'test'
            await service.get(key)
            expect(redisMock.get).toHaveBeenLastCalledWith(key)
        })

        it('returns value from redis.get()', async () => {
            const value = 'test'
            redisMock.get = jest.fn(async () => value)
            const result = await service.get('test')
            expect(result).toEqual(value)
        })
    })

    describe('set()', () => {
        it('calls redis.set() with correct parameters', async () => {
            redisMock.set = jest.fn()
            const key = 'testkey'
            const value = 'testvalue'
            await service.set(key, value)
            expect(redisMock.set).toHaveBeenLastCalledWith(key, value, { EX: config.redisExpiry })
        })
    })

})
