const _onlyEmojis = /^(((?:<(:\w+:|a:\w+:)(\d+)>|(?:\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]))(\s*?))+)$/

export const unicodeEmojis = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/

export function hasOnlyEmojis(text) { return _onlyEmojis.test(text) }

export function isAllowedEmoji(feature, message, emoji) {
    if (feature.isAllowedEmoji) {
        return feature.isAllowedEmoji(message, emoji)
    }
    if (feature.emojis) {
        return feature.emojis.includes(emoji.name)
    }
    return true
}
