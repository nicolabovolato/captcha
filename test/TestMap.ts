import IMap from '../src/services/IMap'

export default class TestMap implements IMap<string, string> {

    public internal: Map<string, string> = new Map()

    public async get(key: string): Promise<string | null> {
        return this.internal.get(key) ?? null
    }

    public async set(key: string, value: string): Promise<void> {
        this.internal.set(key, value)
    }
}
