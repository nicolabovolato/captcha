import ICaptchaService, { CaptchaInfo } from './ICaptchaService'
import IMap from './IMap'
import Captcha from '@haileybot/captcha-generator'
import { v4 as uuidv4 } from 'uuid'
import { injectable, inject } from 'tsyringe'
import Logger from './Logger'

@injectable()
export default class CaptchaService implements ICaptchaService {

    public constructor(@inject('IMap<string,string>') private store: IMap<string, string>, private logger: Logger) { }

    public async generate(): Promise<CaptchaInfo> {
        const id = uuidv4()
        const captcha = new Captcha()

        await this.store.set(id, captcha.value)

        return { id, jpegBase64: captcha.dataURL }
    }

    public async verify(id: string, answer: string): Promise<boolean> {
        const value = await this.store.get(id)

        return value == answer
    }
}
