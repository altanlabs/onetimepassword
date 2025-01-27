export interface SecureMessage {
  id: string;
  fields: {
    encrypted_content: string;
    access_token: string;
    is_password: boolean;
    created_at: string;
  };
}

export interface ApiError {
  message: string;
  status?: number;
}