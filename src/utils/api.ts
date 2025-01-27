import { SecureMessage, ApiError } from '@/types/api';
import { storeMessageLocally, retrieveMessageLocally } from './storage';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key';
const BASE_ID = import.meta.env.VITE_BASE_ID || '18d2c498-1f23-415e-be2e-6799ee8f1c37';
const TABLE_ID = import.meta.env.VITE_TABLE_ID || '02c5f113-a433-45cc-b4f6-c1ebfed31823';
const API_KEY = import.meta.env.VITE_ALTAN_API_KEY;
const API_BASE_URL = 'https://api.altan.ai';

// Función para generar un token único
const generateToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Función simple de encriptación usando base64 para el modo demo
const encryptDemo = (text: string): string => {
  return btoa(text);
};

// Función simple de desencriptación usando base64 para el modo demo
const decryptDemo = (text: string): string => {
  return atob(text);
};

// Función para hacer peticiones a la API
const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  if (!API_KEY) {
    throw new Error('API key not configured');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error: ApiError = {
      message: 'API request failed',
      status: response.status,
    };
    try {
      const data = await response.json();
      error.message = data.message || error.message;
    } catch {} // Ignorar errores al parsear la respuesta
    throw error;
  }

  return response.json();
};

// Función para probar la conexión a la API
const testApiConnection = async (): Promise<boolean> => {
  if (!API_KEY) return false;
  try {
    await fetchApi(`/bases/${BASE_ID}`);
    return true;
  } catch {
    return false;
  }
};

// Función para almacenar mensajes
export const storeMessage = async (message: string, isPassword: boolean = false): Promise<string> => {
  if (!message) throw new Error('Message cannot be empty');

  try {
    // Intentar usar la API de Altan primero
    const hasConnection = await testApiConnection();
    
    if (hasConnection) {
      const encryptedContent = encryptDemo(message);
      const accessToken = generateToken();
      
      await fetchApi(`/bases/${BASE_ID}/tables/${TABLE_ID}/records`, {
        method: 'POST',
        body: JSON.stringify({
          fields: {
            encrypted_content: encryptedContent,
            access_token: accessToken,
            is_password: isPassword,
            created_at: new Date().toISOString(),
          },
        }),
      });

      return accessToken;
    } else {
      // Si no hay conexión, usar almacenamiento local
      console.log('Using local storage as fallback');
      return storeMessageLocally(message, isPassword);
    }
  } catch (error) {
    console.error('Error storing message:', error);
    // Si hay cualquier error, intentar el almacenamiento local
    return storeMessageLocally(message, isPassword);
  }
};

// Función para recuperar y eliminar mensajes
export const retrieveMessage = async (token: string): Promise<string> => {
  if (!token) throw new Error('Token cannot be empty');

  try {
    // Intentar usar la API de Altan primero
    const hasConnection = await testApiConnection();
    
    if (hasConnection) {
      // Buscar el mensaje en la API
      const searchData = await fetchApi(
        `/bases/${BASE_ID}/tables/${TABLE_ID}/records?filter=access_token="${token}"`
      );

      if (!searchData.records || searchData.records.length === 0) {
        // Si no se encuentra en la API, intentar en local
        const localMessage = retrieveMessageLocally(token);
        if (localMessage) return localMessage;
        throw new Error('Message not found or already viewed');
      }

      const record = searchData.records[0] as SecureMessage;
      const decryptedMessage = decryptDemo(record.fields.encrypted_content);

      // Eliminar el mensaje
      await fetchApi(
        `/bases/${BASE_ID}/tables/${TABLE_ID}/records/${record.id}`,
        { method: 'DELETE' }
      );

      return decryptedMessage;
    } else {
      // Si no hay conexión, intentar recuperar del almacenamiento local
      const localMessage = retrieveMessageLocally(token);
      if (!localMessage) throw new Error('Message not found or already viewed');
      return localMessage;
    }
  } catch (error) {
    // Si hay cualquier error con la API, intentar el almacenamiento local
    const localMessage = retrieveMessageLocally(token);
    if (!localMessage) {
      console.error('Error retrieving message:', error);
      throw new Error('Message not found or already viewed');
    }
    return localMessage;
  }
};