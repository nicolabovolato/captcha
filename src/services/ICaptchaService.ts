export type CaptchaInfo = {
    id: string,
    jpegBase64: string,
}

export default interface ICaptchaService {
    generate(): Promise<CaptchaInfo>
    verify(id: string, answer: string): Promise<boolean>
}
