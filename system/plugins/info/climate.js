const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    command: "clima",
    alias: [],
    category: ["info"],
    description: "Ver las condiciones climáticas en un área específica.",
    loading: true,
    limit: true,
    async run(m, { sock, text, Func }) {
        if (!text) {
            return m.reply("Por favor, proporciona una ubicación para obtener el clima.");
        }

        try {
            const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=db2ea3e94f1e4cbbbf805708252701 &q=${text}`);
            const res = response.data;

            const {
                name,
                region,
                country,
                lat,
                lon,
                tz_id,
                localtime_epoch,
                localtime
            } = res.location;

            const {
                last_updated_epoch,
                last_updated,
                temp_c,
                temp_f,
                is_day,
                wind_mph,
                wind_kph,
                wind_degree,
                wind_dir,
                pressure_mb,
                pressure_in,
                precip_mm,
                precip_in,
                condition,
                humidity,
                cloud,
                feelslike_c,
                feelslike_f,
                vis_km,
                vis_miles,
                uv,
                gust_mph,
                gust_kph
            } = res.current;



            const width = 600;
            const height = 400;
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');

            const backgroundImage = await loadImage('https://files.catbox.moe/h6dumg.jpg');
            ctx.drawImage(backgroundImage, 0, 0, width, height); 

            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = '#000000';
            ctx.font = 'bold 24px Arial';
            ctx.fillText(`Clima en ${name}, ${region}, ${country}`, 30, 40);
            ctx.font = '20px Arial';
            ctx.fillText(`Última Actualización: ${last_updated}`, 30, 80);
            ctx.fillText(`Temp: ${temp_c} °C`, 30, 110);
            ctx.fillText(`Condición: ${condition.text}`, 30, 140);
            ctx.fillText(`Humedad: ${humidity}%`, 30, 170);
            ctx.fillText(`Viento: ${wind_mph} mph`, 30, 200);
            ctx.fillText(`Presión: ${pressure_mb} mb`, 30, 230);
            ctx.fillText(`Sensación Térmica: ${feelslike_c} °C`, 30, 260);
            ctx.fillText(`Visibilidad: ${vis_km} km`, 30, 290);
            ctx.fillText(`UV: ${uv}`, 30, 320);

            ctx.strokeStyle = '#FF5733';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(30, 340);
            ctx.lineTo(width - 30, 340);
            ctx.stroke();

            let caption = `
*- - - - [ CONDICIÓN ] - - -*
${condition.text}

*Nombre:* ${name}
*Región:* ${region}
*País:* ${country}
*Latitud:* ${lat}
*Longitud:* ${lon}
*ID de Zona Horaria:* ${tz_id}
*Epoch de Hora Local:* ${localtime_epoch}
*Hora Local:* ${localtime}

*- - - - [ DETALLADO ] - - -*
*Última Actualización Epoch:* ${last_updated_epoch}
*Última Actualización:* ${last_updated}
*Temperatura Celsius:* ${temp_c}
*Temperatura Fahrenheit:* ${temp_f}
*Es Día:* ${is_day ? "Sí" : "No"}
*Viento Mph:* ${wind_mph}
*Viento Kph:* ${wind_kph}
*Grado del Viento:* ${wind_degree}
*Dirección del Viento:* ${wind_dir}
*Presión Mb:* ${pressure_mb}
*Presión In:* ${pressure_in}
*Precipitación Mm:* ${precip_mm}
*Precipitación In:* ${precip_in}
*Humedad:* ${humidity}
*Nubes:* ${cloud}
*Sensación Térmica Celsius:* ${feelslike_c}
*Sensación Térmica Fahrenheit:* ${feelslike_f}
*Visibilidad Km:* ${vis_km}
*Visibilidad Millas:* ${vis_miles}
*UV:* ${uv}
*Ráfaga Mph:* ${gust_mph}
*Ráfaga Kph:* ${gust_kph}`.trim();

            let buff = canvas.toBuffer();
            await sock.sendMessage(m.cht, { image: buff, caption: caption }, { quoted: m });
        } catch (error) {
            console.error("Error al obtener el clima:", error);
            m.reply("Ocurrió un error al intentar obtener el clima. Por favor, intenta de nuevo más tarde.");
        }
    }
};