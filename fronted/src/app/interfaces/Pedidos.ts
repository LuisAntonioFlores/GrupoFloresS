export interface Pedido {
  _id?: string;
  numero_Pedido: string;
  cliente_id: string;
  date_Pedido?: Date;
  status?: string;
  items: Item[];
  total_price: number;
  direccion_id?: string;
  estado_entrega?: string;
  createdAt?: string;

}

export interface Item {
  product_id: string;
  title: string;
  quantity: number;
  price: number;

}
