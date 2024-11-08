export interface AuthResponse {
    token: string;
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    sexo?: string; 
    tipoUsuario?: string;
    _id?: string;
  }