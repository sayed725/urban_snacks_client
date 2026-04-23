"use server"

import { orderServices } from "./order.cervices";


export const getMyAllOrders = async () => {
  
  const result =  await orderServices.getMyOrders();
  return result; // { data, error }

};

