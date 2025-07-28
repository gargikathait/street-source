import { MockDatabase } from '../../shared/database';

export const config = {
  runtime: 'edge', // optional, for edge functions
};

export default async function handler(request: Request): Promise<Response> {
  const { method } = request;

  if (method === 'GET') {
    const url = new URL(request.url);
    const vendorId = url.searchParams.get("vendorId");

    const vendor = MockDatabase.getVendor(vendorId ?? '');
    return Response.json({ success: true, data: vendor });
  }

  if (method === 'PUT') {
    const body = await request.json();
    return Response.json({ success: true, message: 'Vendor updated', data: body });
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}
