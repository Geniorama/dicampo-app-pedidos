import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Client } from "@/app/types";


type InitialStateProps = {
    clients: Client[]
    selectedClient?: Client | null
}

const initialState:InitialStateProps = {
    clients: [],
    selectedClient: null
}

export const clientSlice = createSlice({
    name: "clients",
    initialState,
    reducers:{
        setClients: (state, action:PayloadAction<Client[]>) => {
            state.clients = action.payload
        },
        setSelectedClient: (state, action:PayloadAction<Client>) =>{
            state.selectedClient = action.payload
        }
    }
})

export const {
    setClients,
    setSelectedClient
} = clientSlice.actions

export default clientSlice.reducer