export function verifyRolePosition(context, member, role) {
    const bot = context.guild.member(context.client.user)
    return isAllowed(bot, role) && (isAllowed(member, role) || member.id === context.guild.ownerID)
}

function isAllowed(member, role) {
    return member.roles.highest.comparePositionTo(role) > 0
}