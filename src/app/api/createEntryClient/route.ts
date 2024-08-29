// pages/api/createEntry/route.ts
import { getSpace } from "../../../lib/contentful";
import type { Client, Contact } from "../../types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const environment = await getSpace();

    const { companyId, companyName, address }: Client = await request.json();

    const entry = await environment.createEntry("client", {
      fields: {
        companyId: {
          es: companyId, // Change 'es' to your locale code
        },
        companyName: {
          es: companyName, // Change 'es' to your locale code
        },
        address: {
          es: address, // Change 'es' to your locale code
        },
      },
    });

    await entry.publish();

    return NextResponse.json({ id: entry.sys.id }, { status: 200 });
  } catch (error) {
    console.error("Failed to create entry:", error);
    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const data = await request.json();
  const { clientId, contactId }: { clientId: string, contactId: string } = data;

  try {
    const environment = await getSpace();

    // Obtener la entrada principal (client) por ID
    const entry = await environment.getEntry(clientId);

    // Actualizar la entrada principal para asociar el campo `contact`
    entry.fields.contact = {
      "es": {
        "sys": {
          "id": contactId,
          "linkType": "Entry",
          "type": "Entry"
        }
      }
    };

    // Guardar y publicar la entrada actualizada
    const updatedEntry = await entry.update();
    await updatedEntry.publish();

    return NextResponse.json({ success: true, entry: updatedEntry }, { status: 200 });
  } catch (error) {
    console.error("Failed to update entry:", error);
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 }
    );
  }
}
