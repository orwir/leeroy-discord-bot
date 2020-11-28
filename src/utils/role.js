export function canSetRole(context, role) {
    const bot = context.guild.member(context.client.user)
    const member = context.member
    return hasRoleHigherThan(bot, role)
        && (hasRoleHigherThan(member, role) || member.id === context.guild.ownerID)
}

export function hasRoleHigherThan(member, role) {
    return member.roles.highest.comparePositionTo(role) > 0
}
