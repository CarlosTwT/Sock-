module.exports = {
  command: "carbon",
  alias: ["convertir"],
  category: ["converter"],
  description: "Convierte código en una imagen",
  loading: true,
  async run(m, { sock, Func }) {

     const codeToConvert = m.quoted ? m.quoted.text : m.text;
     if (!codeToConvert) throw 'Por favor, proporciona un código para convertir.';

    try {
    
      let response = await fetch('https://carbonara.solopov.dev/api/cook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: codeToConvert,
          backgroundColor: '#1F816D',
        }),
      });

      if (!response.ok) throw 'La API no devolvió una respuesta válida.';

      let arrayBuffer = await response.arrayBuffer();
      let buffer = Buffer.from(arrayBuffer);

      await m.reply({ image: buffer, caption: 'Imagen generada por Carbon' });
    } catch (error) {
      await m.reply('Ocurrió un error: ' + error);
    }
  }
};