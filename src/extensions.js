String.prototype.isBlank = function() {
    return !this || !this.trim()
}

Object.prototype.path = function(path, defValue) {
    let value = this
    for (let segment of path.split('.')) {
        let index
        if (segment.charAt(segment.length - 1) === ']') {
            index = parseInt(segment.charAt(segment.length - 2))
            segment = segment.slice(0, -3)
        }
        if (segment.charAt(0) === '{') {
            for (let variant of segment.slice(1, -1).split('|')) {
                if (value[variant]) {
                    value = value[variant]
                    break
                }
            }
        } else {
            value = value[segment]
        }
        if (index && Array.isArray(value)) {
            value = value[index]
        }
        if (!value) {
            break
        }
    }
    return value ? value : defValue
}