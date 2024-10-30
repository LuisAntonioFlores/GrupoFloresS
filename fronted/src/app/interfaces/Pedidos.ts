export interface Pedido {
    numero_Pedido: string;
    cliente_id: string;
    date_Pedido?: Date;
    status?: 'Pending' | 'Shipped' | 'Delivered';
    items: Item[];
    total_price: number;
    direccion_id?: string;
  }
  
  export interface Item {
    product_id: string;
    quantity: number;
    price: number;
    
  }
  