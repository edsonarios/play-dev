export const cleanCovers = (covers: string[]) => covers.map((cover) => cover.replace('Covers/', ''))

export const cleanCover = (cover: string) => cover.replace('Covers/', '')
