const moment = require('moment-timezone');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  command: "calendario",
  alias: ["calend"],
  category: ["tools"],
  description: "Crea un calendario para un mes y año específicos.",
  loading: false,
  async run(m, { sock, text }) {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const dayNames = [
      'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
    ];

    const args = text.split(' ').map(arg => arg.trim());
    const year = args[0] ? parseInt(args[0]) : moment().year();
    const month = args[1] ? parseInt(args[1]) - 1 : moment().month();
    const startDate = moment([year, month]);

    const width = 800;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const backgroundImage = await loadImage('https://files.catbox.moe/700crf.jpg');
    ctx.drawImage(backgroundImage, 0, 0, width, height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(0, 0, width, 100);

    ctx.fillStyle = '#4A90E2';
    ctx.fillRect(0, 0, width, 100);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px Arial';
    ctx.fillText(`SOCK - CALENDARIO ${year}`, 50, 50);
    ctx.font = 'bold 36px Arial';
    ctx.fillText(monthNames[month], 50, 90);

    ctx.fillStyle = '#333';
    ctx.font = 'bold 20px Arial';
    const daySpacing = (width - 100) / 7;
    let dayX = 50;
    const offsetX = 45;
    dayNames.forEach(day => {
      ctx.fillText(day, dayX + daySpacing / 2 - offsetX, 150);
      dayX += daySpacing;
    });

    ctx.strokeStyle = '#FF5733';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 160);
    ctx.lineTo(width - 50, 160);
    ctx.stroke();

    const currentDate = moment().date();
    let dates = [];
    for (let i = 0; i < startDate.startOf('month').day(); i++) {
      dates.push('');
    }

    for (let day = 1; day <= startDate.daysInMonth(); day++) {
      dates.push(day);
    }

    let dateX = 50;
    let dateY = 200;
    ctx.font = '28px Arial';
    dates.forEach((date, index) => {
      if (index % 7 === 0 && index > 0) {
        dateX = 50;
        dateY += 60;
      }
      
      if (date) {
        if (date === currentDate && startDate.month() === moment().month() && startDate.year() === moment().year()) {
          ctx.fillStyle = '#FF1493';
          ctx.beginPath();
          ctx.moveTo(dateX + 75, dateY - 20);
          ctx.bezierCurveTo(dateX + 55, dateY - 40, dateX + 55, dateY + 10, dateX + 75, dateY + 10);
          ctx.bezierCurveTo(dateX + 95, dateY + 10, dateX + 95, dateY - 40, dateX + 75, dateY - 20);
          ctx.fill();
          ctx.fillStyle = '#000000';
        } else if (dayNames[index % 7] === 'Domingo') {
          ctx.fillStyle = '#FF0000';
        } else {
          ctx.fillStyle = '#000000';
        }
        
        ctx.textAlign = 'center';
        ctx.fillText(date, dateX + 75, dateY + 10);
      }

      dateX += daySpacing;
    });

    let lineX = 50;
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.moveTo(lineX, 160);
      ctx.lineTo(lineX, dateY + 50);
      ctx.stroke();
      lineX += daySpacing;
    }

    let lineY = 160;
    for (let i = 0; i <= (dates.length / 7); i++) {
      ctx.beginPath();
      ctx.moveTo(50, lineY);
      ctx.lineTo(width - 50, lineY);
      ctx.stroke();
      lineY += 60;
    }

    const buffer = canvas.toBuffer();
    await sock.sendMessage(m.cht, { image: buffer, caption: "> Calendario para este mes" }, { quoted: m });
  }
};