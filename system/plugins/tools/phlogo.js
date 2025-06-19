const axios = require('axios');
const qs = require('qs');
const cheerio = require('cheerio');
const FormData = require('form-data');

async function ephoto(textInput, textInput2) {
    let formData = new FormData();
    let url = 'https://en.ephoto360.com/create-pornhub-style-logos-online-free-549.html';

    let initialResponse = await axios.get(url, {
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
        }
    });

    let $ = cheerio.load(initialResponse.data);

    let token = $('input[name=token]').val();
    let buildServer = $('input[name=build_server]').val();
    let buildServerId = $('input[name=build_server_id]').val();

    formData.append('text[]', textInput);
    formData.append('text[]', textInput2);
    formData.append('token', token);
    formData.append('build_server', buildServer);
    formData.append('build_server_id', buildServerId);

    let postResponse = await axios({
        url: url,
        method: 'POST',
        data: formData,
        headers: {
            'Accept': '/',
            'Accept-Language': 'en-US,en;q=0.9',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
            'cookie': initialResponse.headers['set-cookie']?.join(' '),
            ...formData.getHeaders()
        }
    });

    let $$ = cheerio.load(postResponse.data);
    let formValueInput = JSON.parse($$('input[name=form_value_input]').val());
    const body = qs.stringify(formValueInput, { arrayFormat: 'brackets' });

    const hasil = await axios.post('https://en.ephoto360.com/effect/create-image', body, {
        headers: {
            'accept': '/',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'x-requested-with': 'XMLHttpRequest',
            'cookie': initialResponse.headers["set-cookie"].join("; "),
            'Referer': 'https://en.ephoto360.com/create-pornhub-style-logos-online-free-549.html'
        }
    });

    return buildServer + hasil.data.image;
}

module.exports = {
    command: "pornhublogo",
    alias: [],
    category: ["tools"],
    description: "Genera un logo al estilo Pornhub a partir de dos textos.",
    loading: true,
    async run(m, { sock, text }) {
        const args = text.split(' ');
        if (args.length < 2) {
            return m.reply('Uso: #pornhublogo [texto1] [texto2]');
        }

        let [text1, text2] = args;

        try {
            let imageUrl = await ephoto(text1, text2);
            await sock.sendMessage(m.cht, { image: { url: imageUrl } }, { quoted: m });
        } catch (error) {
            console.error(error);
            m.reply('Falló al crear el logo. Intenta de nuevo más tarde.');
        }
    }
};