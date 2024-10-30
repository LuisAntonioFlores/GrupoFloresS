// interfaces/copomex.ts
export interface ResponseItem {
    cp: string;
    asentamiento: string;
    tipo_asentamiento: string;
    municipio: string;
    estado: string;
    ciudad: string;
    pais: string;
  }
  
  export interface ApiResponse {
    error: boolean;
    code_error: number;
    error_message: string | null;
    response: ResponseItem;
  }
  