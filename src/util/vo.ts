class KeyValue {
    key: string
    value: string

    constructor(key: string, value: string) {
        this.key = key
        this.value = value
    }
}

class OnlyValue {
    value: string

    constructor(value: string) {
        this.value = value
    }
}

export {
    KeyValue,
    OnlyValue
}
