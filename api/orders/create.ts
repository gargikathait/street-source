import { MockDatabase } from '../../shared/database'

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await req.json();
  const newOrder = MockDatabase.createOrder(body);

  return new Response(JSON.stringify({ success: true, data: newOrder }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
