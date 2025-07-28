// api/materials.ts
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (id) {
    // fetch one material
  } else {
    // fetch all materials
  }
}

