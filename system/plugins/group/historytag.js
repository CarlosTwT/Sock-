const baileys = require('baileys');

module.exports = {
    command: "history",
    alias: ["statustag"],
    category: ["group"],
    description: "Enviar un estado mencionado a los participantes del grupo",
    loading: true,
    settings: {
        group: true,
        owner: true
    },
    async run(m, { sock, text }) {
        if (!baileys.proto.Message.ProtocolMessage.Type.STATUS_MENTION_MESSAGE) {
            throw new Error("no STATUS_MENTION_MESSAGE found in ProtocolMessage (is your WAProto up-to-date?)");
        }

        const fetchParticipants = async (...jids) => {
            let results = [];
            for (const jid of jids) {
                let { participants } = await sock.groupMetadata(jid);
                participants = participants.map(({ id }) => id);
                results = results.concat(participants);
            }
            return results;
        };

        async function mentionStatus(jids, content) {
            const msg = await baileys.generateWAMessage(baileys.STORIES_JID, content, {
                upload: sock.waUploadToServer
            });

            let statusJidList = [];
            for (const _jid of jids) {
                if (_jid.endsWith("@g.us")) {
                    for (const jid of await fetchParticipants(_jid)) {
                        statusJidList.push(jid);
                    }
                } else {
                    statusJidList.push(_jid);
                }
            }
            statusJidList = [...new Set(statusJidList)];

            await sock.relayMessage(msg.key.remoteJid, msg.message, {
                messageId: msg.key.id,
                statusJidList,
                additionalNodes: [
                    {
                        tag: "meta",
                        attrs: {},
                        content: [
                            {
                                tag: "mentioned_users",
                                attrs: {},
                                content: (jids || statusJidList).map((jid) => ({
                                    tag: "to",
                                    attrs: {
                                        jid
                                    },
                                    content: undefined
                                }))
                            }
                        ]
                    }
                ]
            });

            for (const jid of jids) {
                let type = (jid.endsWith("@g.us") ? "groupStatusMentionMessage" : "statusMentionMessage");
                await sock.relayMessage(jid, {
                    [type]: {
                        message: {
                            protocolMessage: {
                                key: msg.key,
                                type: 25
                            }
                        }
                    }
                }, {
                    additionalNodes: [
                        {
                            tag: "meta",
                            attrs: {
                                is_status_mention: "true"
                            },
                            content: undefined
                        }
                    ]
                });
            }

            return msg;
        }

        const groupId = m.cht;
        const content = {
            text: text
        };


        await mentionStatus([groupId], content);
    }
};