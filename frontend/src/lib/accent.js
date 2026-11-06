// Custom accents are stored in the same preference as the existing preset keys.
export function normalizeAccent(value) {
  if (typeof value !== 'string') return null
  const text = value.trim().toLowerCase()
  const hex = /^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/.exec(text)?.[1]
  if (hex) return '#' + (hex.length <= 4 ? [...hex].map(digit => digit.repeat(2)).join('') : hex)
  const rgb = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/.exec(text)
  const rgba = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*((?:\d+)?(?:\.\d+)?)(?:\s*)\)$/.exec(text)
  const match = rgb || rgba
  if (!match || (rgba && !match[4])) return null
  const channels = match.slice(1, 4).map(Number)
  if (channels.some(channel => channel > 255)) return null
  if (rgba && Number(match[4]) > 1) return null
  if (rgba) channels.push(Math.round(Number(match[4]) * 255))
  return hexOf(channels)
}

const hexOf = channels => '#' + channels.map(channel => channel.toString(16).padStart(2, '0')).join('')
const channelsOf = hex => hex.slice(1).match(/../g).map(pair => parseInt(pair, 16))
const luminance = channels => channels.reduce((sum, channel, index) => {
  const v = channel / 255
  return sum + [0.2126, 0.7152, 0.0722][index] * (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
}, 0)
const contrast = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
const blend = (a, b, amount) => a.map((value, index) => Math.round(value + (b[index] - value) * amount))

// Resolve transparency against the card. A colour too close to the backdrop is
// nudged towards a readable light/dark shade, including in native notifications.
export function customAccentPalette(value, theme) {
  const hex = normalizeAccent(value)
  if (!hex) return null
  const light = theme === 'light'
  const surface = light ? [255, 255, 255] : [28, 28, 30]
  const background = light ? [242, 242, 247] : [0, 0, 0]
  const [r, g, b, alpha = 255] = channelsOf(hex)
  const base = blend(surface, [r, g, b], alpha / 255)
  const target = light ? [0, 0, 0] : [255, 255, 255]
  const backdrops = [surface, background].map(luminance)
  let color = base
  for (let step = 1; step <= 100 && backdrops.some(bg => contrast(luminance(color), bg) < 4.5); step++) {
    color = blend(base, target, step / 100)
  }
  return { color: hexOf(color), ink: luminance(color) >= 0.179 ? '#000000' : '#ffffff' }
}
