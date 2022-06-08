import 'reflect-metadata'
import { container } from 'tsyringe'

import Config from './config'
import { build, configure } from './build'

configure()
const server = build()
const config = container.resolve(Config)

server.listen(config.port, '0.0.0.0', (err) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
})
