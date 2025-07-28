import { MockDatabase } from '../../shared/database'

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const orderId = url.searchParams.get('orderId') || '';

  if (req.method === 'GET') {
    const tracking = MockDatabase.getDeliveryTracking(orderId);
    return new Response(JSON.stringify({ success: true, data: tracking }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}
