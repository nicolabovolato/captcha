import { Logger as Pino } from 'pino'
import { singleton } from 'tsyringe'

@singleton()
export default class Logger {

    private logger: Pino

    public constructor(logger: Pino) {
        this.logger = logger
    }

    public info(obj: any, msg: string | undefined, ...args: any[]) {
        this.logger.info(obj, msg, args)
    }

    public warn(obj: any, msg: string | undefined, ...args: any[]) {
        this.logger.warn(obj, msg, args)
    }

    public error(obj: any, msg: string | undefined, ...args: any[]) {
        // console.log(this.logger)
        //this.logger.error('AAAAAAAA')
        this.logger.error(obj, msg, args)
    }
}
