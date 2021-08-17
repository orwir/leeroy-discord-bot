import LZString from 'lz-string'
import { path } from './object.js'

export function resolve(message) {
    const meta = LZString.decompressFromUTF16(path(message, 'embeds[0].footer.text') || '')
    if (meta) return JSON.parse(meta)
    return null
}

export function compress(feature, data) {
    return LZString.compressToUTF16(JSON.stringify({
        feature: feature,
        ...data
    }))
}
