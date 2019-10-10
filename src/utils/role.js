export function verifyRolePosition(context, role) {
    return isAllowed(context.guild.member(context.client.user), role) && isAllowed(context.member, role)
}

function isAllowed(member, role) {
    return member.highestRole.comparePositionTo(role) > 0
}