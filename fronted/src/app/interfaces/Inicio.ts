export interface AuthResponse {
    token: string;
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    sexo?: string; 
    
    tipoUsuario?: string;
    _id?: string;

    email?: string;  // Correo electrónico del usuario (opcional)
    fechaNacimiento?: string;  // Fecha de nacimiento del usuario (opcional)
    imagen?: string; 
    clienteNombre?: string;
  }