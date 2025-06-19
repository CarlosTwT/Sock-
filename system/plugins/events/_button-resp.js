async function events(m, {
    sock
}) {
    if (m.type === "interactiveResponseMessage" && m.quoted.fromMe) {
        sock.appendTextMessage(
            m,
            JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id,
            m,
        );
    }
}

module.exports = {
    events
};
