interface Color {
  light: string
  dark: string
}

export type IColorRecord = Record<string, Color>

export const colors: IColorRecord = {
  red: { light: '#da2735', dark: '#7f1d1d' },
  orange: { light: '#cc5400', dark: '#7c2d12' },
  yellow: { light: '#ffae00', dark: '#78350f' },
  green: { light: '#21c872', dark: '#14532d' },
  teal: { light: '#2ee9d7', dark: '#134e4a' },
  blue: { light: '#2c54c2', dark: '#1e3a8a' },
  indigo: { light: '#394bd5', dark: '#312e81' },
  purple: { light: '#df24ff', dark: '#581c87' },
  pink: { light: '#f33b73', dark: '#831843' },
  emerald: { light: '#0c6e54', dark: '#064e3b' },
  rose: { light: '#ed2377', dark: '#871b48' },
  gray: { light: '#37373b', dark: '#2b2b30' },
  dark: { light: '#2b2b30', dark: '#18181b' }
}
