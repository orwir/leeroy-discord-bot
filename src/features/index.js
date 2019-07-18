export function features() {
    return [

        ]
        .reduce((features, feature) => {
            features[feature.name] = feature
            return features
        }, {})
}

export default features()