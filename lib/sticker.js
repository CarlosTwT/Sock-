const fs = require("node:fs");
const Crypto = require("crypto");
const ff = require("fluent-ffmpeg");
const webp = require("node-webpmux");
const path = require("path");

const temp = process.platform === "win32" ? process.env.TEMP : "/tmp";

async function imageToWebp(media) {
	const tmpFileIn = path.join(temp, `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.${media?.ext || 'png'}`);
	const tmpFileOut = path.join(temp, `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);

	fs.writeFileSync(tmpFileIn, media.data);

	try {
		await new Promise((resolve, reject) => {
			ff(tmpFileIn)
				.on('error', reject)
				.on('end', () => resolve(true))
				.addOutputOptions(['-vcodec', 'libwebp', '-vf', 'scale=\'min(320,iw)\':min\'(320,ih)\':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=000000 [p]; [b][p] paletteuse'])
				.toFormat('webp')
				.saveToFile(tmpFileOut);
		});

		fs.promises.unlink(tmpFileIn);
		const buff = fs.readFileSync(tmpFileOut);
		fs.promises.unlink(tmpFileOut);

		return buff;
	} catch (e) {
		fs.existsSync(tmpFileIn) ? fs.promises.unlink(tmpFileIn) : '';
		fs.existsSync(tmpFileOut) ? fs.promises.unlink(tmpFileOut) : '';
		throw e;
	}
}

async function videoToWebp(media) {
	const tmpFileIn = path.join(temp, `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.${media?.ext || 'mp4'}`);
	const tmpFileOut = path.join(temp, `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);

	fs.writeFileSync(tmpFileIn, media.data);

	try {
		await new Promise((resolve, reject) => {
			ff(tmpFileIn)
				.on('error', reject)
				.on('end', () => resolve(true))
				.addOutputOptions([
					'-vcodec',
					'libwebp',
					'-vf',
					'scale=\'min(320,iw)\':min\'(320,ih)\':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=000000 [p]; [b][p] paletteuse',
					'-loop',
					'0',
					'-ss',
					'00:00:00',
					'-t',
					'00:00:05',
					'-preset',
					'default',
					'-an',
					'-vsync',
					'0',
				])
				.toFormat('webp')
				.saveToFile(tmpFileOut);
		});

		fs.promises.unlink(tmpFileIn);
		const buff = fs.readFileSync(tmpFileOut);
		fs.promises.unlink(tmpFileOut);

		return buff;
	} catch (e) {
		fs.existsSync(tmpFileIn) ? fs.promises.unlink(tmpFileIn) : '';
		fs.existsSync(tmpFileOut) ? fs.promises.unlink(tmpFileOut) : '';
		throw e;
	}
}

async function exifAi(buffer, packId, packPubls, categories = [''], extra = {}) {
  const img = new webp();
  
  const json = { 
    'sticker-pack-id': 'https://github.com/CarlosTwT', 
    'sticker-pack-name': packId, 
    'sticker-pack-publisher': packPubls, 
    'emojis': categories, 
    'is-ai-sticker': 1, 
    ...extra 
  };

  let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
  let jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
  let exif = Buffer.concat([exifAttr, jsonBuffer]);
  exif.writeUIntLE(jsonBuffer.length, 14, 4);
  
  await img.load(buffer);
  img.exif = exif;

  return await img.save(null);
}


async function writeExif(media, metadata) {
	let wMedia = /webp/.test(media.mimetype) ? media.data : /image/.test(media.mimetype) ? await imageToWebp(media) : /video/.test(media.mimetype) ? await videoToWebp(media) : '';

	if (metadata && Object?.keys(metadata).length !== 0) {
		const img = new webp.Image();
		const json = {
			'sticker-pack-id': metadata?.packId || `hisoka-${Date.now()}`,
			'sticker-pack-name': metadata?.packName || '',
			'sticker-pack-publisher': metadata?.packPublish || '',
			'android-app-store-link': metadata?.androidApp || 'https://play.google.com/store/apps/details?id=com.bitsmedia.android.muslimpro',
			'ios-app-store-link': metadata?.iOSApp || 'https://apps.apple.com/id/app/muslim-pro-al-quran-adzan/id388389451?|=id',
			emojis: metadata?.emojis || ['😋', '😎', '🤣', '😂', '😁'],
			'is-avatar-sticker': metadata?.isAvatar || 0,
		};
		const exifAttr = Buffer.from([0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
		const jsonBuff = Buffer.from(JSON.stringify(json), 'utf-8');
		const exif = Buffer.concat([exifAttr, jsonBuff]);
		exif.writeUIntLE(jsonBuff.length, 14, 4);
		await img.load(wMedia);
		img.exif = exif;

		return await img.save(null);
	}
}

module.exports = {
 writeExif,
 videoToWebp,
 imageToWebp,
 exifAi 
}