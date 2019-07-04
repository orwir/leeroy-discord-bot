module.exports = [
        ...require('./utility'),
        ...require('./fun'),
        ...require('./access')
    ]
    .reduce((features, feature) => {
        features[feature.name] = feature
    }, {})