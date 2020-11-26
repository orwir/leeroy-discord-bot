const _emoji = /^(((?:<(:\w+:|a:\w+:)(\d+)>|(?:\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]))(\s{0,1}?))+)$/

export function isContentEmoji(text) {
    return Boolean(_emoji.test(text) || _dsEmoji.test(text))
}