import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify'
import { Static, Type } from '@sinclair/typebox'
import { container } from 'tsyringe'
import CaptchaService from '../services/CaptchaService'

const GenerateCaptchaSchema = {
    response: {
        201: Type.Object({
            id: Type.String({ format: 'uuid' }),
            jpegBase64: Type.String({ contentEncoding: 'base64', contentMediaType: 'image/jpeg' }),
        }),
    },
}

const ValidateCaptchaParams = Type.Object({
    id: Type.String({ format: 'uuid' }),
})
type ValidateCaptchaParamsType = Static<typeof ValidateCaptchaParams>

const ValidateCaptchaBody = Type.Object({
    answer: Type.String(),
})
type ValidateCaptchaBodyType = Static<typeof ValidateCaptchaBody>

const ValidateCaptchaSchema = {
    params: ValidateCaptchaParams,
    body: ValidateCaptchaBody,
}

const plugin: FastifyPluginAsync<FastifyPluginOptions> = async (fastify, _opts) => {

    const service = container.resolve(CaptchaService)

    fastify.post('/captchas', { schema: GenerateCaptchaSchema }, async (req, res) => {
        const captcha = await service.generate()
        return res.status(201).send(captcha)
    })

    fastify.put<{ Params: ValidateCaptchaParamsType, Body: ValidateCaptchaBodyType }>
        ('/captchas/:id', { schema: ValidateCaptchaSchema }, async (req, res) => {

            const valid = await service.verify(req.params.id, req.body.answer.toUpperCase())

            if (!valid) return res.status(401).send()

            return res.status(200).send()
        })
}

export default plugin
