module.exports = {
    command: "whatanime",
    alias: ["wanime"],
    category: ["tools"],
    description: "Busca información de un anime a partir de una imagen",
    loading: true,
    async run(m, { sock, Func, config, Uploader }) {
        try {
            const q = m.quoted || m;
            const mime = (q.msg || q).mimetype || '';
            
            if (!mime) return m.reply("Responde o envía una imagen de un anime");
            if (!/image\/(jpe?g|png)/.test(mime)) return m.reply("Formato de imagen no soportado. Usa JPG/PNG");

            const media = await q.download();
            const uploaded = await Uploader.catbox(media);

            const { result } = await Func.fetchJson(`https://api.trace.moe/search?anilistInfo&url=${uploaded}`);
            const bestMatch = result[0];

            const { 
                anilist: { 
                    title, 
                    synonyms, 
                    isAdult 
                },
                episode,
                similarity,
                image
            } = bestMatch;

            const infoAnime = `
*🎌 ¿Qué Anime Es?*

▢ *Título:* ${title.romaji} (${title.native})
▢ *Sinónimos:* ${synonyms.join(", ") || "Ninguno"}
▢ *Contenido Adulto:* ${isAdult ? "✅ Sí" : "❌ No"}
▢ *Similitud:* ${(similarity * 100).toFixed(1)}%
▢ *Episodio:* ${episode || "Desconocido"}

> by Sock`;
            await sock.sendMessage(m.cht, { 
                image: { url: image }, 
                caption: infoAnime 
            }, { quoted: m });

        } catch (error) {
            console.error(error);
            m.reply("Error al procesar la imagen. Intenta con otra.");
        }
    }
};