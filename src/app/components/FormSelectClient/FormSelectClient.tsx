"use client";

import type { Client, Contact } from "@/app/types";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { setSelectedClient } from "@/lib/features/clientSlice";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function FormSelectClient() {
  const [isNew, setIsNew] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [idEntryClient, setIdEntryClient] = useState<string | null>(null);

  const { clients, selectedClient } = useAppSelector((state) => state.client);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<Client>();

  const createEntryClient = async (data: Client) => {
    const response = await fetch("/api/createEntryClient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create entry");
    }

    return response.json();
  };

  const includeContactInClient = async (
    entryClientId: string,
    entryContactId: string
  ) => {
    const response = await fetch("/api/createEntryClient", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: entryClientId,
        contactId: entryContactId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create entry");
    }

    return response.json();
  };

  const createEntryContact = async (data: Contact) => {
    const response = await fetch("/api/createEntryContact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create entry");
    }

    return response.json();
  };

  const onSubmit: SubmitHandler<Client> = async (data) => {
    if (data.contact && idEntryClient) {
      const transformContactData = {
        ...data.contact,
        phone: "+57" + data.contact.phone
      }
      try {
        const response = await createEntryContact(transformContactData);
        if (response.id) {
          const res = await includeContactInClient(idEntryClient, response.id);
          if (res) {
            dispatch(setSelectedClient(null))
            window.location.href="/"
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    setLoading(false);
  };

  const handleChange = (e: any) => {
    const value = e.target.value;
    setCurrentStep(1);

    if (value === "new") {
      setIsNew(true);
    } else {
      // setClientSelected(value);
      const updatedClientSelected = clients.find(client => client.id === value)

      if(updatedClientSelected){
        dispatch(setSelectedClient(updatedClientSelected))
      }
      setIsNew(false);
    }
  };

  const handleNextStep = async () => {
    setLoading(true);

    // Mostrar confirmación
    const result = await Swal.fire({
      title: "Confirmación",
      text: "Revisa antes tus datos, porque no podrás regresar a este paso ¿Estás seguro de que deseas continuar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      // Validar el paso actual
      const isStepValid = await trigger(); // Valida el paso actual
      if (isStepValid) {
        const currentData = watch();
        if (currentStep === 1) {
          try {
            const response = await createEntryClient(currentData);

            if (response.id) {
              setIdEntryClient(response.id);
              setCurrentStep((prevStep) => prevStep + 1);
            }
            setLoading(false);
          } catch (error) {
            console.error(error);
            setLoading(false);
          }
        }
      }
    } else {
      setLoading(false);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleInitOrder = () =>{
    router.push('/dashboard/create-order')
  }

  return (
    <>
      <div>
        <label
          className="mb-2 block font-medium text-slate-800 text-sm"
          htmlFor=""
        >
          Cliente
        </label>
        <select
          onChange={handleChange}
          className="w-full h-10 px-2 outline-none disabled:opacity-50"
          value={isNew ? 'new' : selectedClient ? selectedClient.id : ''}
          disabled={currentStep !== 1}
        >
          <option disabled value="">
            Selecciona una opción
          </option>
          {clients.map((client) => (
            <option key={client.id} value={client.id} className="">
              {client.companyName}
            </option>
          ))}
          <option value="new">Nuevo Cliente</option>
        </select>

        {selectedClient && !isNew && (
          <button
            onClick={handleInitOrder}
            className=" bg-orange-600 text-white w-full p-2 mt-2"
          >
            Ir a pedidos
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-5">
          {isNew && (
            <div>
              <hr className="mt-5 mb-3" />
              <span className=" block h-1 w-full bg-slate-200 mb-4 relative">
                <span className={`h-full bg-green-500 block transition ${currentStep === 1 ? 'w-1/2' : 'w-full'}`}></span>
              </span>
              <h3 className=" text-center mb-2 block font-bold text-slate-800">
                Crear nuevo cliente
              </h3>

              {/* STEP 1 */}
              {currentStep === 1 && (
                <fieldset className="mt-5 space-y-4">
                  <legend className="text-xs text-center font-bold text-green-600">
                    - 1. Información de la empresa -
                  </legend>
                  <div>
                    <label
                      className="mb-2 block font-medium text-slate-800 text-sm"
                      htmlFor="company-name"
                    >
                      Nombre del negocio *
                    </label>
                    <input
                      required
                      type="text"
                      {...register("companyName", { required: true })}
                      id="company-name"
                      className="h-[40px] w-full px-2 focus:ring-1 focus:ring-[#ee6b28] outline-none"
                    />
                  </div>

                  <div>
                    <label
                      className="mb-2 block font-medium text-slate-800 text-sm"
                      htmlFor="address"
                    >
                      Dirección *
                    </label>
                    <input
                      type="text"
                      {...register("address", { required: true })}
                      id="address"
                      className="h-[40px] w-full px-2 focus:ring-1 focus:ring-[#ee6b28] outline-none"
                    />
                  </div>

                  <div>
                    <label
                      className="mb-2 block font-medium text-slate-800 text-sm"
                      htmlFor="company-id"
                    >
                      ID (NIT, RUIP, CC) *
                    </label>
                    <input
                      placeholder="1234567890"
                      type="text"
                      {...register("companyId", { required: true })}
                      id="company-id"
                      className="h-[40px] w-full px-2 focus:ring-1 focus:ring-[#ee6b28] outline-none"
                    />
                  </div>

                  <button
                    disabled={loading}
                    type="button"
                    onClick={handleNextStep}
                    className=" bg-orange-600 text-white w-full p-2 mt-2"
                  >
                    {loading ? "Creando empresa" : "Siguiente"}
                  </button>
                </fieldset>
              )}

              {currentStep === 2 && (
                <fieldset className="mt-5 space-y-4">
                  <legend className="text-xs text-center text-xs text-center font-bold text-green-600">
                    - 2. Información de contacto -
                  </legend>
                  <div>
                    <label
                      className="mb-2 block font-medium text-slate-800 text-sm"
                      htmlFor="first-name"
                    >
                      Nombre(s) *
                    </label>
                    <input
                      required
                      type="text"
                      {...register("contact.firstName", { required: true })}
                      id="first-name"
                      className="h-[40px] w-full px-2 focus:ring-1 focus:ring-[#ee6b28] outline-none"
                    />
                  </div>

                  <div>
                    <label
                      className="mb-2 block font-medium text-slate-800 text-sm"
                      htmlFor="last-name"
                    >
                      Apellido(s) *
                    </label>
                    <input
                      required
                      type="text"
                      {...register("contact.lastName", { required: true })}
                      id="last-name"
                      className="h-[40px] w-full px-2 focus:ring-1 focus:ring-[#ee6b28] outline-none"
                    />
                  </div>

                  <div>
                    <label
                      className="mb-2 block font-medium text-slate-800 text-sm"
                      htmlFor="email"
                    >
                      Email *
                    </label>
                    <input
                      required
                      type="email"
                      {...register("contact.email", { required: true })}
                      id="email"
                      className="h-[40px] w-full px-2 focus:ring-1 focus:ring-[#ee6b28] outline-none"
                    />
                  </div>

                  <div>
                    <label
                      className="mb-2 block font-medium text-slate-800 text-sm"
                      htmlFor="type-document"
                    >
                      Tipo de documento
                    </label>
                    <select
                      className="w-full h-10 px-2 focus:ring-1 focus:ring-[#ee6b28] outline-none"
                      {...register("contact.typeDoc", { required: true })}
                      id="type-document"
                      defaultValue={"cc"}
                    >
                      <option disabled value="">
                        Selecciona una opción
                      </option>
                      <option value="cc">Cédula de ciudadanía</option>
                      <option value="ce">Cédula de extranjería</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className="mb-2 block font-medium text-slate-800 text-sm"
                      htmlFor="num-document"
                    >
                      Número de documento *
                    </label>
                    <input
                      required
                      type="number"
                      {...register("contact.numDoc", { required: true })}
                      id="num-document"
                      className="h-[40px] w-full px-2 focus:ring-1 focus:ring-[#ee6b28] outline-none"
                    />
                  </div>

                  <div>
                    <label
                      className="mb-2 block font-medium text-slate-800 text-sm"
                      htmlFor="phone"
                    >
                      Teléfono *
                    </label>
                    <div className="relative">
                      <input
                        required
                        placeholder="3001234567"
                        type="number"
                        {...register("contact.phone", { required: true })}
                        id="phone"
                        className="h-[40px] w-full px-2 focus:ring-1 focus:ring-[#ee6b28] outline-none pl-12"
                      />
                      <span className="absolute top-0 left-0 h-full w-50px flex justify-center items-center p-1 text-slate-600">
                        +57 |
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    {/* <button
                      type="button"
                      onClick={handlePrevStep}
                      className=" bg-gray-600 text-white w-1/2 p-2 mt-2 mr-2"
                    >
                      Anterior
                    </button> */}
                    <button
                      type="submit"
                      className=" bg-orange-600 text-white w-full p-2 mt-2"
                    >
                      {currentStep !== 2 ? 'Crear empresa' : 'Crear contacto'}
                    </button>
                  </div>
                </fieldset>
              )}
            </div>
          )}
        </div>
      </form>
    </>
  );
}
