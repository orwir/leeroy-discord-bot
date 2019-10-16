export function verifyRolePosition(context, role) {
    return isAllowed(context.guild.member(context.client.user), role)
        && (isAllowed(context.member, role) || context.member.id === context.guild.ownerID)
}

function isAllowed(member, role) {
    return member.highestRole.comparePositionTo(role) > 0
}