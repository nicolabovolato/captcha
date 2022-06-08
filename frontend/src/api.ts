import urlJoin from 'url-join'
import axios from 'axios'

const baseUrl = new URL(import.meta.env.VITE_API_URL)
const v1 = new URL('v1', baseUrl)
const captchas = urlJoin(v1.toString(), 'captchas')

export type GenerateCaptchaResponse = {
    id: string,
    jpegBase64: string
}

export type SolveCaptchaRequest = {
    answer: string
}

export const generateCaptcha = async (): Promise<GenerateCaptchaResponse> => {
    const response = await axios.post(captchas)
    return response.data
}

export const solveCaptcha = async (id: string, data: SolveCaptchaRequest): Promise<boolean> => {

    try {
        await axios.put(urlJoin(captchas, id), data)
    }
    catch (err: any) {
        if (err.response.status == 401) return false
        throw err
    }
    return true
}
