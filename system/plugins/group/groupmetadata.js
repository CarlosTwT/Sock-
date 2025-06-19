const { getGroupMetadata } = require('baileys');
module.exports = {
    command: "metadata",
    alias: ["groupinfo"],
    category: ["group"],
    description: "Mostrar información del grupo",
    loading: true,
    settings: {
        group: true
    },
    async run(m, { sock }) {
        const groupMetadata = await sock.groupMetadata(m.cht);
        const groupName = groupMetadata.subject;

        const timeUnix = (timeStamp) => {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const date = new Date(timeStamp * 1000);
            const year = date.getFullYear();
            const month = months[date.getMonth()];
            const day = date.getDate();
            const hour = date.getHours();
            const minute = date.getMinutes();
            const second = date.getSeconds();
            return `${day} ${month} ${year} ${hour}:${minute}:${second}`;
        };

        const infoGroup = `*- Group Metadata Info -*\n\n` +
            `*Group ID:* ${groupMetadata.id}\n\n` +
            `*Group Name:*  ${groupName}\n\n` +
            `*Name Since:*  ${timeUnix(groupMetadata.subjectTime)}\n\n` +
            `*Group Creation:* ${timeUnix(groupMetadata.creation)}\n\n` +
            `*Owner Group:* ${groupMetadata.owner !== undefined ? await sock.getName(groupMetadata.owner) : "-"}\n\n` +
            `*Members:* ${groupMetadata.size} member(s).\n\n` +
            `*Join Approval:* ${groupMetadata.joinApprovalMode ? "Yes" : "No"}.\n\n` +
            `*Member Add Mode:* ${groupMetadata.memberAddMode ? "Yes" : "No"}.\n\n` +
            `*Disappearing Message:* ${groupMetadata.ephemeralDuration !== undefined ? groupMetadata.ephemeralDuration / (24 * 60 * 60) + " Days" : "OFF"}.\n\n` +
            `*Description:*\n${groupMetadata.desc || "No description available."}`;

        await m.reply(infoGroup);
    }
};