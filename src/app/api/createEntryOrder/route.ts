import { getSpace } from "@/lib/contentful";
import { NextResponse } from "next/server";
import type { Order } from "@/app/types";

export async function POST(request: Request) {
  try {
    const environment = await getSpace();

    const { startDate, clientId, items, notes, total, clientName, sellerEmail }: Order =
      await request.json();

    const itemsObject = {
      lineItems: items
    }

    const entry = await environment.createEntry("order", {
      fields: {
        clientName: {
          es: clientName
        },

        clientId: {
          es: clientId,
        },

        startDate: {
          es: startDate,
        },

        items: {
          es: itemsObject
        },

        notes: {
          es: notes,
        },

        total: {
          es: total,
        },

        sellerEmail: {
          es: sellerEmail,
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
