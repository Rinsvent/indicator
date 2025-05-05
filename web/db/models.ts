export enum LevelEnum {
    Success = 'success',
    Warning = 'warning',
    Error = 'error',
    Critical = 'critical',
}

export type Indicator = {
    code: string
    level: LevelEnum
    text: string
    tags: string[]
    revisionAt: Date
}
