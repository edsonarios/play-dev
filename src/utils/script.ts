// La lista de videos musicales en un string
const data = `'Batman - Im not a hero.mp4'
'El Dador de Recuerdos - Escena - Piano (The Giver) - 720p.mp4'
'El Origen de Juego de Tronos - CANCIÓN Parodia - Destripando la Historia - 720p.mp4'
"Hans Zimmer live @ Pirates At World's End Premiere.mp4"
'La La Land -  John Legend  - Start a Fire.mp4'
'Pirataas del caribe - Parley.mp4'
'Piratas del caribe - One Day.mp4'
'Piratas del Caribe - The Kracken.mp4'
'Piratas del Caribe - Up Is Down.mp4'
'Tenicius D - Diablo Song.mp4'`

// El array de salida
const output = []

// Separar el string por saltos de línea y obtener un array de nombres de archivos
const files = data.split('\n')

// Recorrer el array de nombres de archivos
for (let i = 0; i < files.length; i++) {
  // Obtener el nombre del archivo sin las comillas
  const file = files[i].replaceAll(/'/g, '').replaceAll(/"/g, '')

  // Crear un objeto json con los atributos deseados
  const json = {
    id: i + 1, // El id es el índice del bucle más uno
    albumId: 1, // El albumId es un valor fijo
    title: file.slice(0, -4), // El title es el nombre del archivo sin la extensión
    image: 'https://vinyl.lofirecords.com/cdn/shop/products/VINYL_MORNING_COFFEE_min.png', // La image es una url aleatoria con el índice del bucle más uno
    artists: ['Peliculas Songs'], // Los artists son un array con un valor fijo
    album: 'Chill Lo-Fi Music', // El album es un valor fijo
    duration: `${Math.floor(Math.random() * 5) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`, // La duration es un valor aleatorio entre 1:00 y 5:59
    format: file.slice(-3) // El format es la extensión del archivo
  }

  // Agregar el objeto json al array de salida
  output.push(json)
}

// Mostrar el array de salida
console.log(output)
