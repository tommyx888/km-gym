import QRCode from 'qrcode';

/** QR kód ako inline SVG (bez okraja, tmavé moduly v danej farbe). */
export async function qrSvg(text: string, color = '#000000', size = 320): Promise<string> {
  const svg = await QRCode.toString(text, { type: 'svg', errorCorrectionLevel: 'M', margin: 0, width: size, color: { dark: color, light: '#00000000' } });
  return svg;
}
