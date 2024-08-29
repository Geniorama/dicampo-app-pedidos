import { NextResponse } from "next/server";
import { getSpace } from "@/lib/contentful";

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName, typeDoc, numDoc, phone } = await request.json();

    // Get Space and Environment
    const environment = await getSpace()

    // Create the contact entry
    const contactEntry = await environment.createEntry("contact", {
      fields: {
        email: {
          es: email,
        },
        firstName: {
          es: firstName,
        },
        lastName: {
          es: lastName,
        },
        typeDoc: {
          es: typeDoc,
        },
        numDoc: {
          es: numDoc,
        },
        phone: {
          es: phone,
        }
      },
    });

    // Publish the contact entry
    await contactEntry.publish();

    // Return the ID of the newly created contact entry
    return NextResponse.json({ id: contactEntry.sys.id }, { status: 200 });
  } catch (error) {
    console.error("Failed to create contact entry:", error);
    return NextResponse.json(
      { error: "Failed to create contact entry" },
      { status: 500 }
    );
  }
}


