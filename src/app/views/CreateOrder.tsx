"use client";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Product, Attribute, ItemCart } from "../types";
import { setAllProducts } from "@/lib/features/cartSlice";
import { convertToPrice } from "../utils/formatters";
import { FieldValues, useForm } from "react-hook-form";
import { addItem, removeItem } from "@/lib/features/cartSlice";
import { SubmitHandler } from "react-hook-form";
import type { Order } from "../types";
import { useUser } from "@auth0/nextjs-auth0/client";

type CreateOrderProps = {
  products: any;
};

export default function CreateOrder({ products }: CreateOrderProps) {
  const [openModal, setOpenModal] = useState(false);
  const [productOnStage, setProductOnStage] = useState<Product | null>(null);
  const [currentTotal, setCurrentTotal] = useState(0);
  const { selectedClient } = useAppSelector((state) => state.client);
  const [sellerEmail, setSellerEmail] = useState<string | null | undefined>('')
  const { allProducts, itemsCart, totalAmount } = useAppSelector(
    (state) => state.cart
  );
  
  const router = useRouter();
  const user = useUser();

  const dispatch = useAppDispatch();

  const { watch, trigger, handleSubmit, register, reset } = useForm();

  useEffect(() => {
    if (!selectedClient || selectedClient.id === "") {
      router.push("/create-client");
    }
  });

  useEffect(() =>{
    if(user && user.user){
      const userEmail = user.user.name
      setSellerEmail(userEmail)
    }
  },[user])

  const createEntryOrder = async (data: Order) => {
    const response = await fetch("/api/createEntryOrder", {
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

  const transformDataProducts = (data: any) => {
    const updatedProducts: Product[] = data.map((product: any) => {
      const { name, price, description, attributes } = product.fields;
      return {
        id: product.sys.id,
        name,
        price,
        description,
        attributes: attributes.map((attr: any) => ({
          id: attr.sys.id,
          name: attr.fields.name,
          values: attr.fields.values,
        })),
      };
    });

    return updatedProducts;
  };

  useEffect(() => {
    if (products) {
      console.log(products);
      const updatedProducts = transformDataProducts(products);
      dispatch(setAllProducts(updatedProducts));
    }
  }, [products, dispatch]);

  useEffect(() => {
    const selectedProductId = watch("productId");
    if (selectedProductId && selectedProductId) {
      const selectedProduct = allProducts.find(
        (product) => product.id === selectedProductId
      );
      setProductOnStage(selectedProduct || null);
    }
  }, [watch("productId"), allProducts]);

  useEffect(() => {
    const productQuantity = watch("quantity");
    if (productQuantity && productOnStage) {
      const updateSubtotal = productOnStage.price * productQuantity;

      setCurrentTotal(updateSubtotal);
    }
  }, [watch("quantity"), productOnStage]);

  if (!products || products.lenght < 1) {
    return <h1>Loading</h1>;
  }

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleRemoveItem = (item: ItemCart) => {
    dispatch(
      removeItem({ id: item.id, attributesSelected: item.attributesSelected })
    );
  };

  const formatDataForGoogleSheets = (data: Order["items"]) => {
    return data
      .map((item) => {
        const attributes = item.attributesSelected
          ?.map(
            (attr) =>
              `${attr.name}: ${attr.lines
                .map((line) => `${line.value} (Cantidad: ${line.quantity})`)
                .join(", ")}`
          )
          .join("\n");

        return `Producto: ${item.name}\nPrecio: ${item.price}\nCantidad: ${item.quantity}\nSubtotal: ${item.subtotal}\n${attributes}`;
      })
      .join("\n\n");
  };

  const sendDataToWebHook = (
    data: Order,
    dataContact: { contactEmail: string | undefined; contactPhone: string | undefined}
  ) => {
    const webhookUrl =
      "https://hook.us1.make.com/pul9wk1svgffc1682vihb0eojaggewu8";

    const orderData = {
      ...data,
      items: formatDataForGoogleSheets(data.items),
      clientEmail: dataContact.contactEmail,
      clientPhone: dataContact.contactPhone,
    };

    console.log("order nost formated", data);
    console.log("order formatted", orderData);

    fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then((response) => response.json())
      .then((data) => console.log("Success:", data))
      .catch((error) => console.error("Error:", error));
  };

  const handleCreateOrder = async () => {
    const formattedDate = new Date().toISOString();
    if (selectedClient?.id && itemsCart) {
      const order: Order = {
        clientName: selectedClient.companyName,
        items: itemsCart,
        startDate: `${formattedDate}`,
        clientId: selectedClient.id,
        notes: "anywhere",
        total: Number(totalAmount),
        sellerEmail: sellerEmail
      };

      try {
        const res = await createEntryOrder(order);
        console.log(res);
      } catch (error) {
        console.log(error);
      }

      const contact = {
        contactEmail: selectedClient.contactEmail,
        contactPhone: selectedClient.contactPhone,
      };

      sendDataToWebHook(order, contact);

      router.push('/thank-you')
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (productOnStage) {
      const selectedAttributes = productOnStage.attributes.map((attr) => ({
        id: attr.id,
        name: attr.name,
        lines: [
          {
            value: data.attributes[attr.id].value,
            quantity: data.quantity,
          },
        ],
      }));

      const productToAdd: ItemCart = {
        // ...productOnStage,
        name: productOnStage.name,
        price: productOnStage.price,
        id: productOnStage.id,
        attributesSelected: selectedAttributes,
        quantity: data.quantity,
        subtotal: productOnStage.price * data.quantity,
      };

      // Despacha la acción para agregar el producto al carrito
      dispatch(addItem(productToAdd));

      console.log("Producto agregado", productToAdd);
      console.log("Cart products", itemsCart);

      reset();

      setCurrentTotal(0);

      // Cierra el modal
      handleCloseModal();
      setProductOnStage(null);
    }
  };

  return (
    <div className="p-4">
      {openModal && (
        <div className="w-screen h-screen fixed bg-opacity-80 bg-black top-0 left-0 p-2 flex justify-center items-center">
          <div className=" bg-white w-[90%] max-w-md p-5 text-sm">
            <h4 className="text-xl font-bold text-slate-900">
              Agrega tu producto
            </h4>

            <form onSubmit={handleSubmit(onSubmit)}>
              <select
                {...register("productId", { required: true })}
                className="w-full border py-2 px-1 mt-3"
              >
                <option value="">Selecciona un producto</option>
                {allProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              {productOnStage && productOnStage.attributes.length > 0 ? (
                <div className="my-3">
                  {productOnStage.attributes.map((attr) => (
                    <div key={attr.id}>
                      <label className="font-semibold text-sm" htmlFor="">
                        {attr.name}:
                      </label>
                      <div className="flex my-1 gap-1">
                        <select
                          defaultValue={""}
                          className="flex-grow border py-2 px-1"
                          {...register(`attributes.${attr.id}.value`, {
                            required: true,
                          })}
                        >
                          <option disabled value="">
                            Selecciona una opción
                          </option>
                          {attr.values.map((val) => (
                            <option key={val} value={val}>
                              {val}
                            </option>
                          ))}
                        </select>
                        <input
                          className="border w-14 p-2"
                          type="number"
                          defaultValue={1}
                          min={1}
                          {...register(`quantity`, {
                            required: true,
                            min: 1,
                          })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="my-4 text-center">
                  Selecciona un producto para ver opciones
                </p>
              )}

              <span className="font-bold text-lg mt-2 block text-slate-700">
                Subtotal: {convertToPrice(currentTotal)}
              </span>

              <div className=" flex gap-1 mt-3">
                <button
                  onClick={handleCloseModal}
                  className=" block w-1/2 p-2 bg-slate-500 text-white font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className=" block w-1/2 p-2 bg-orange-600 text-white font-semibold"
                >
                  Agregar al pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <h1 className="font-bold text-slate-700 text-lg">2. Crear pedido</h1>
      {/* {selectedClient?.companyName} */}

      {itemsCart && itemsCart.length > 0 && (
        <>
          <h3 className="mt-5 text-sm font-semibold">Resumen pedido</h3>
          <table className="w-full bg-white mt-3">
            <thead className="border-b bg-slate-800 text-white">
              <tr>
                <th className="text-left p-3">Producto</th>
                <th className="text-left p-3">Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {itemsCart.map((item) => (
                <tr key={item.id} className="border-b text-sm">
                  <td className="p-3 leading-4">
                    <span className="font-bold">{item.name}</span> <br />
                    {item.attributesSelected?.map((attr) => (
                      <div key={attr.id} className="text-xs">
                        <span className="font-semibold">{attr.name}:</span>
                        {attr.lines.map((line, index) => (
                          <span key={index} className="block">
                            {line.value} ({line.quantity})
                          </span>
                        ))}
                      </div>
                    ))}
                  </td>
                  <td className="p-3">{convertToPrice(item.subtotal)}</td>
                  <td>
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="bg-red-600 flex justify-center items-center w-5 h-5 text-white text-xs rounded-full"
                    >
                      x
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="py-4 mt-1 text-center">
            <h5 className="text-slate-700 text-center text-2xl">
              TOTAL: <b>{convertToPrice(totalAmount)}</b>
            </h5>
            <button
              onClick={handleOpenModal}
              className="w-full text-center bg-green-600 p-2 font-bold text-white text-lg mt-3"
            >
              Agregar más productos
            </button>
            <button
              onClick={handleCreateOrder}
              className="w-full text-center bg-orange-600 p-2 font-bold text-white text-lg mt-3"
            >
              Realizar pedido
            </button>
          </div>
        </>
      )}

      {!itemsCart ||
        (itemsCart.length < 1 && (
          <>
            <h3 className="text-sm font-semibold mt-5">Tabla de productos</h3>
            <p className="text-sm mt-2 text-slate-700">
              Haz click en <b>{`"Iniciar el pedido"`}</b> para ver los{" "}
              <b>sabores</b>
            </p>
            <table className="my-4 w-full">
              <thead className="text-left">
                <tr>
                  <th className="border-b border-slate-200 p-2 text-sm bg-slate-600 text-white">
                    Nombre
                  </th>
                  <th className="border-b border-slate-200 p-2 text-sm bg-slate-600 text-white">
                    Valor unit
                  </th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map((product) => (
                  <tr key={product.id} className="text-sm">
                    <td className="border-b border-slate-300 p-1 py-3 text-slate-600 font-medium">
                      {product.name}
                    </td>
                    <td className="border-b border-slate-300 p-1 py-3 text-slate-600 font-medium">
                      {convertToPrice(product.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={handleOpenModal}
              className="text-center block w-full bg-orange-600 p-2 text-white font-semibold"
            >
              Iniciar el pedido
            </button>
          </>
        ))}
    </div>
  );
}
