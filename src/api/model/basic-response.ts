export default interface Response<T> {
    code: number
    msg: string
    data?: T
}

export interface Pageable<T> {
    totalCount: number
    data: Array<T>
}
