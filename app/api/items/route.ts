import { NextResponse } from "next/server";
let items = [
  { id: 1, title: "Alpha", description: "First item (server)" },
  { id: 2, title: "Bravo", description: "Second item (server)" },
  { id: 3, title: "Charlie", description: "Third item (server)" },
];
export async function GET() {
  return NextResponse.json(items);
}
export async function POST(req: Request) {
  const body = await req.json();
  const id = Math.max(...items.map((i) => i.id)) + 1;
  const created = {
    id,
    title: body.title ?? "Untitled",
    description: body.description ?? "",
  };
  items = [...items, created];
  return NextResponse.json(created, { status: 201 });
}
