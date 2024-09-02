import { combineReducers } from "@reduxjs/toolkit";

import cartSlice from "./features/cartSlice";
import clientSlice from "./features/clientSlice";

const rootReducer = combineReducers({
    cart: cartSlice,
    client: clientSlice
})

export default rootReducer;