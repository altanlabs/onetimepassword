// Lista de URLs de imágenes de fondo
export const backgroundImages = [
  'https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=2960&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?q=80&w=2829&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2940&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1557682260-96773eb01377?q=80&w=2942&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1557682204-e53b55fd750c?q=80&w=2940&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2940&auto=format&fit=crop',
];

// Función para obtener una imagen aleatoria
export const getRandomBackground = (): string => {
  const randomIndex = Math.floor(Math.random() * backgroundImages.length);
  return backgroundImages[randomIndex];
};