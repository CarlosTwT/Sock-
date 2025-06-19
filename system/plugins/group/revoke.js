module.exports = {
  command: "resetlink",
  alias: ["revoke"],
  category: ["group"],
  settings: {
    group: true,
    admin: true,
    botAdmin: true,
  },
  description: "Para restablecer el enlace del grupo",
  async run(m, { sock }) {
    await sock
      .groupRevokeInvite(m.cht)
      .then((a) =>
        m.reply("> *- Link group new :* https://chat.whatsapp.com/" + a),
      );
  },
};
