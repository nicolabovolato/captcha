import pino from 'pino'
import CaptchaService from '../src/services/CaptchaService'
import TestMap from './TestMap'
import Logger from '../src/services/Logger'

describe('CaptchaService', () => {

    const map = new TestMap()
    const logger = new Logger(pino({ level: 'silent' }))
    const service = new CaptchaService(map, logger)


    describe('generate()', () => {

        it('sets the map', async () => {

            const { id } = await service.generate()

            expect(map.internal.has(id)).toBe(true)
        })

    })

    describe('validate()', () => {

        beforeEach(() => {
            map.internal.clear()
        })

        const cases: [string, string, boolean][] = [
            ['a', 'a', true],
            ['A', 'A', true],
            ['test1234', 'test1234', true],
            ['TEST1234', 'TEST1234', true],
            ['', '', true],
            ['a', '', false],
            ['a', 'A', false],
            ['A', 'a', false],
            ['TEST1234', 'test1234', false],
            ['test1234', 'TEST1234', false],
            ['test1234', 'test123', false],
            ['TEST1234', 'est1234', false],
            ['TEST1234', 'TEST', false],
            ['TEST1234', '1234', false],
            ['', 'a', false],
            ['a', '', false]
        ]

        cases.forEach(c => {

            const value = c[0]
            const input = c[1]
            const expected = c[2]

            it(`should return ${expected} when input = ${input} and value = ${value}`, async () => {

                map.internal.set('test', value)
                const result = await service.verify('test', input)
                expect(result).toBe(expected)

            })
        })

        it('should return false with missing key', async () => {
            const result = await service.verify('nonexistent', '')
            expect(result).toBe(false)
        })

    })
})
