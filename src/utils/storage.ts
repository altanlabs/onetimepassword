const STORAGE_KEY = 'secure_messages';
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key';

interface StoredMessage {
  id: string;
  encryptedContent: string;
  isPassword: boolean;
  createdAt: string;
  expiresAt: string;
}

// Función simple de encriptación usando base64 para el modo demo
const encryptDemo = (text: string): string => {
  return btoa(text);
};

// Función simple de desencriptación usando base64 para el modo demo
const decryptDemo = (text: string): string => {
  return atob(text);
};

// Limpiar mensajes expirados
const cleanExpiredMessages = () => {
  const messages = getAllMessages();
  const now = new Date().toISOString();
  const validMessages = messages.filter(msg => msg.expiresAt > now);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(validMessages));
  return validMessages;
};

// Obtener todos los mensajes
const getAllMessages = (): StoredMessage[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Guardar mensaje
export const storeMessageLocally = (
  content: string,
  isPassword: boolean = false
): string => {
  // Limpiar mensajes antiguos primero
  cleanExpiredMessages();

  // Encriptar el contenido (usando base64 para demo)
  const encryptedContent = encryptDemo(content);
  
  // Generar ID único
  const id = Math.random().toString(36).substring(2, 15) + 
            Math.random().toString(36).substring(2, 15);

  // Crear nuevo mensaje
  const newMessage: StoredMessage = {
    id,
    encryptedContent,
    isPassword,
    createdAt: new Date().toISOString(),
    // El mensaje expira en 24 horas
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  // Obtener mensajes existentes y añadir el nuevo
  const messages = getAllMessages();
  messages.push(newMessage);
  
  // Guardar en localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));

  return id;
};

// Recuperar y eliminar mensaje
export const retrieveMessageLocally = (id: string): string | null => {
  // Limpiar mensajes antiguos primero
  const messages = cleanExpiredMessages();
  
  // Encontrar el mensaje
  const messageIndex = messages.findIndex(msg => msg.id === id);
  if (messageIndex === -1) return null;

  // Obtener y eliminar el mensaje
  const message = messages[messageIndex];
  messages.splice(messageIndex, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));

  // Desencriptar y devolver el contenido
  try {
    return decryptDemo(message.encryptedContent);
  } catch {
    return null;
  }
};