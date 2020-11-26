export function path(object, path, def) {
    for (let segment of path.split('.')) {
        let index = -1
        if (segment.charAt(segment.length - 1) === ']') {
            index = parseInt(segment.charAt(segment.length - 2))
            segment = segment.slice(0, -3)
        }
        if (segment.charAt(0) === '{') {
            for (let variant of segment.slice(1, -1).split('|')) {
                if (object[variant]) {
                    object = object[variant]
                    break
                }
            }
        } else {
            object = object[segment]
        }
        if (index >= 0) {
            object = object[index]
        }
        if (!object) break
    }
    return object ? object : def
}
