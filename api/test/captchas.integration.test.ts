import Pino, { Logger as PinoLogger } from 'pino'
import { container } from 'tsyringe'
import { v4 as uuidv4 } from 'uuid'
import { build } from '../src/build'
import Config from '../src/config'
import IMap from '../src/services/IMap'
import Logger from '../src/services/Logger'
import TestMap from './TestMap'

describe('[INTEGRATION] Captchas', () => {

    const config: Config = {
        redisUrl: 'redis://localhost:6379',
        redisExpiry: 1000,
        redisReconnectTimeout: 1000,
        logLevel: 'silent',
        port: 0,
        corsOrigin: false
    }
    const pino = Pino({level: 'silent'})
    const map = new TestMap()

    container.register<Config>(Config, { useValue: config })
    container.register<PinoLogger>('PinoLogger', { useValue: pino})
    container.register<Logger>(Logger, { useValue: new Logger(pino) })
    container.register<IMap<string, string>>('IMap<string,string>', { useValue: map })

    const server = build()

    beforeEach(() => {
        map.internal.clear()
    })

    describe('POST /v1/captchas', () => {
        const endpoint = '/v1/captchas'

        it('Returns 201 on valid request', async () => {
            const result = await server.inject().post(endpoint).end()
            expect(result.statusCode).toBe(201)
        })

        it('Returns valid jpeg url base64', async () => {
            const regex = new RegExp(/^data:image\/jpeg;base64,(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/)

            const result = await server.inject().post(endpoint).end()
            const img = result.json().jpegBase64

            expect(img).toMatch(regex)
        })

        it('Returns different ids', async () => {
            const ids = []

            for(let i=0; i < 10; i++) {
                const result = await server.inject().post(endpoint).end()
                const id = result.json().id
                expect(ids).not.toContain(id)
                ids.push(id)
            }
        })

        it('Returns different images', async () => {
            const images = []

            for(let i=0; i < 10; i++) {
                const result = await server.inject().post(endpoint).end()
                const img = result.json().jpegBase64
                expect(images).not.toContain(img)
                images.push(img)
            }
        })

    })

    describe('PUT /v1/captchas/:id', () => {
        const endpoint = (id: string) => `/v1/captchas/${id}`

        it('Returns 400 with missing params', async () => {
            const id = uuidv4()
            const result = await server.inject().put(endpoint(id)).end()
            expect(result.statusCode).toBe(400)
        })

        it('Returns 401 with wrong value', async () => {
            const id = uuidv4()
            const value = 'test1234'
            map.internal.set(id, value)

            const result = await server.inject()
                .put(endpoint(id))
                .payload({ answer: 'wrongvalue' })
                .end()

            expect(result.statusCode).toBe(401)
        })

        it('Returns 200 with correct value', async () => {
            const id = uuidv4()
            const value = 'TEST1234'
            map.internal.set(id, value)

            const result = await server.inject()
                .put(endpoint(id))
                .payload({ answer: value })
                .end()

            expect(result.statusCode).toBe(200)
        })

    })
})
