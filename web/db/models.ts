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

export function indicatorEquals(i1: Indicator, i2: Indicator) {
    return i1.code === i2.code && i1.tags === i2.tags && i1.text === i2.text && i1.level === i2.level && i1.revisionAt === i2.revisionAt
}

export type Subscribe = {
    docType: 'subscribe'
    tag: string
    createdAt: string
}
