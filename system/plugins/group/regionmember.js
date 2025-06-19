const PhoneNum = require("awesome-phonenumber");

class Command {
  constructor() {
    this.command = "regionmember";
    this.alias = ["allmembers", "totalmember"];
    this.category = ["group"];
    this.settings = {
      group: true,
    };
    this.description =
      "Muestra información sobre el país de origen de todos los miembros en el grupo";
    this.loading = true;
  }

  run = async (m, { sock, Func, Scraper, config, store }) => {
    let regionNames = new Intl.DisplayNames(["es"], { type: "region" });
    let data = m.metadata;
    let participants = data.participants;

    let countryMembers = {};

    for (let participant of participants) {
      let phoneNumber = "+" + participant.id.split("@")[0];
      let regionCode = PhoneNum(phoneNumber).getRegionCode("internacional");
      let country = regionNames.of(regionCode);

      if (!countryMembers[country]) {
        countryMembers[country] = [];
      }
      countryMembers[country].push(participant.id);
    }

    let countryCounts = Object.keys(countryMembers).map((country) => ({
      name: country,
      total: countryMembers[country].length,
      jid: countryMembers[country],
    }));

    let totalSum = countryCounts.reduce(
      (acc, country) => acc + country.total,
      0,
    );
    let totalRegion = Object.keys(countryMembers).length;

    let resultados = countryCounts.map(({ name, total, jid }) => ({
      name,
      total,
      jid,
      percentage: ((total / totalSum) * 100).toFixed(2) + "%",
    }));

    let cap = `*Información de Miembros por Región*\n\n`;
    cap += `> * Nombre del Grupo:* ${m.metadata.subject}\n`;
    cap += `> * Total de Miembros:* ${m.metadata.participants.length}\n`;
    cap += `> * Total de Regiones Registradas:* ${totalRegion}\n\n`;
    cap += `* Estadísticas de Miembros por Región*\n`;
    cap += resultados
      .sort((b, a) => a.total - b.total)
      .map(
        (a, i) =>
          `*${i + 1}. Región:* ${a.name || "No Disponible"}\n> *Total:* ${a.total} miembros\n> *Porcentaje:* ${a.percentage}`,
      )
      .join("\n\n");

    cap += `\n_Utiliza esta información para entender mejor el origen de los miembros del grupo._`;

    m.reply(cap);
  };
}

module.exports = new Command();