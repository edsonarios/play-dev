interface Color {
  accent: string
  dark: string
}

export type IColorRecord = Record<string, Color>

export const colors: IColorRecord = {
  red: { accent: '#da2735', dark: '#7f1d1d' },
  orange: { accent: '#cc5400', dark: '#7c2d12' },
  yellow: { accent: '#ffae00', dark: '#78350f' },
  green: { accent: '#21c872', dark: '#14532d' },
  teal: { accent: '#2ee9d7', dark: '#134e4a' },
  blue: { accent: '#1e3a8a', dark: '#1e3a8a' },
  indigo: { accent: '#394bd5', dark: '#312e81' },
  purple: { accent: '#df24ff', dark: '#581c87' },
  pink: { accent: '#f33b73', dark: '#831843' },
  emerald: { accent: '#0c6e54', dark: '#064e3b' },
  rose: { accent: '#ed2377', dark: '#871b48' },
  gray: { accent: '#7F7F7F', dark: '#535353' },
  dark: { accent: '#1F1F1F', dark: '#18181b' }
}
