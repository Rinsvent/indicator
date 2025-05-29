export enum LevelEnum {
    Success = 'success',
    Warning = 'warning',
    Error = 'error',
    Critical = 'critical',
}

export type Indicator = {
    docType: 'indicator'
    code: string
    level: LevelEnum
    text: string
    tags: string[]
    revisionAt: string
}

export type Subscribe = {
    docType: 'subscribe'
    tag: string
    createdAt: string
}
