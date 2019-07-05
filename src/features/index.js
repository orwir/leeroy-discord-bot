module.exports.obtain = () =>
    [
        // ...require('./access'),
        // ...require('./fun'),
        ...require('./utility')
    ]
    .reduce((features, feature) => {
        features[feature.name] = feature
        return features
    }, {})