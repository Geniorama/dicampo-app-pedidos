import { NextResponse } from "next/server";
import { createClient } from "contentful";

const client = createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
  space: process.env.CONTENTFUL_SPACE_ID as string,
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID parameter is missing' }, { status: 400 });
  }

  try {
    const res = await client.getEntry(id);
    return NextResponse.json({ res, status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch entry' }, { status: 500 });
  }
}
