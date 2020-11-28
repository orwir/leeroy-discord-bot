import { readFileSync } from 'fs'

const res = JSON.parse(readFileSync('./res/colors.json'))

export default {
    highlightDefault: parseInt(res.electricViolet),
    highlightSuccess: parseInt(res.malachite),
    highlightError: parseInt(res.torchRed)
}
