import { Direccion } from 'src/app/interfaces/direccion';
export interface Pedido {
  _id?: string;
  numero_Pedido: string;
  cliente_id: string;
  date_Pedido?: Date;
  status?: string;
  items: Item[];
  total_price: number;
  direccion_id?: string;
  direccion?: Direccion;
  estado_entrega?: string;
  createdAt?: Date;

}

export interface Item {
  product_id: string;
  title: string;
  quantity: number;
  price: number;

}

// respuesta-pedidos.interface.ts
export interface RespuestaPedidos {
  success: boolean;
  data: Pedido[];  // El arreglo de pedidos
  total: number;
  page: number;
  totalPages: number;
}

