
module.exports = {
  command: "product",
  alias: [],
  category: ["owner"],
  description: "Enviar información del producto",
  settings: {
    owner: true,
  },
  async run(m, { sock }) {
    console.log("Ejecutando comando de producto");

    sock.sendMessage(m.cht, {
      body: "S O C K - W A",
      businessOwnerJid: m.sender,
      footer: "whatsapp bot interactive",
      product: {
        currencyCode: "USD",
        description: "Real whatsapp bot",
        productId: "343056591714248",
        productImageCount: 1,
        priceAmount1000: 99999,
        salePriceAmount1000: 99999,
        title: "MY BOT",
        url: "https://instagra.com/c4rl0s_9e",
        productImage: {
          url: "https://telegra.ph/file/7c56992ce2631432d3435.jpg"
        }
      }
    });
  }
};