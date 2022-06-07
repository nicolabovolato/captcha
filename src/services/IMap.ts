export default interface IMap<K, V> {
    get(key: K): Promise<V | null>
    set(key: K, value: V): Promise<void>
}
