import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ItemCart, Product } from "@/app/types";

type InitialStateProps = {
  itemsCart: ItemCart[];
  allProducts: Product[];
  totalAmount: number;
};

const initialState: InitialStateProps = {
  itemsCart: [],
  allProducts: [],
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ItemCart>) => {
      const newItem = action.payload;
      const existingItemIndex = state.itemsCart.findIndex(
        (item) =>
          item.id === newItem.id &&
          JSON.stringify(item.attributesSelected) ===
            JSON.stringify(newItem.attributesSelected)
      );

      if (existingItemIndex !== -1) {
        // Actualiza la cantidad del ítem existente
        state.itemsCart[existingItemIndex].quantity += newItem.quantity;
        state.itemsCart[existingItemIndex].subtotal =
          state.itemsCart[existingItemIndex].price *
          state.itemsCart[existingItemIndex].quantity;
      } else {
        // Agrega un nuevo ítem
        state.itemsCart.push(newItem);
      }

      // Actualiza el totalAmount
      state.totalAmount = state.itemsCart.reduce(
        (total, item) => total + item.subtotal,
        0
      );
    },

    removeItem(state, action: PayloadAction<{ id: string; attributesSelected: ItemCart['attributesSelected'] }>) {
      const { id, attributesSelected } = action.payload;
      const index = state.itemsCart.findIndex(
        (item) =>
          item.id === id &&
          JSON.stringify(item.attributesSelected) === JSON.stringify(attributesSelected)
      );

      if (index !== -1) {
        state.totalAmount -= state.itemsCart[index].subtotal;
        state.itemsCart.splice(index, 1);
      }
    },

    setAllProducts: (state, action: PayloadAction<Product[]>) => {
      state.allProducts = action.payload;
    },

    resetCart: (state) => {
        state = initialState
    }
  },
});

export const { addItem, removeItem, setAllProducts, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
