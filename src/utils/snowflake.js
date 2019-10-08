const P_SNOWFLAKE = /<(@[!&]?|#|:\w+:|a:\w+:)(\d)+>/

export default function (snowflake) {
    if (!snowflake) {
        return null
    }
    const ref = snowflake.match(P_SNOWFLAKE)
    return ref ? ref[2] : null
}