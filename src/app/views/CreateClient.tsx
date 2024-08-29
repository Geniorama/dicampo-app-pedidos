"use client";
import { FormSelectClient } from "../components/FormSelectClient";
import { useAppDispatch } from "@/lib/hooks";
import type { Client } from "../types";
import { useEffect } from "react";
import { setClients } from "@/lib/features/clientSlice";

type CreateClientProps = {
  clients: any
}

export default function CreateClient({clients}:CreateClientProps) {  
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    const updateClients = () => {
        const formattedClients: Client[] = clients.map((client:any) => {
          const {companyName, companyId, address, contact} = client.fields
          return {
            id: client.sys.id,
            companyName: companyName,
            companyId: companyId,
            address: address,
            contactEmail: contact.fields.email,
            contactPhone: contact.fields.phone
          }
        })
        dispatch(setClients(formattedClients))
    }

    if(clients){
      updateClients()
    }
  },[clients, dispatch]);

  // if(!stateClients || stateClients.length <=0){
  //   return <h1>Loading</h1>
  // }

  return (
    <div className="p-4">
      <h1 className="font-bold text-slate-700 text-lg">
        1. Seleccionar cliente
      </h1>
      <p className="text-slate-800 text-sm my-2 mb-5">
        Selecciona un cliente de la lista, si el cliente no existe selecciona{" "}
        {`"Nuevo"`}
      </p>

      <FormSelectClient />
    </div>
  );
}
