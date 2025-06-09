export type TIndicator = {
    code: string
    level: 'success'|'warning'|'error'|'critical'
    text: string
    tags: string[]
    revisionAt: string
}

export type TIndicators = TIndicator[]

export type TIndicatorRequest = {
    level?: 'success'|'warning'|'error'|'critical'
    link?: string
    tags?: string[]
    text?: string
    ttl?: number
}