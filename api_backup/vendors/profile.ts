import { MockDatabase } from '../../shared/database'

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const vendorId = url.searchParams.get('vendorId') || 'vendor_001';
  const vendor = MockDatabase.getVendor(vendorId);

  if (!vendor) {
    return new Response(JSON.stringify({ success: false, error: 'Vendor not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true, data: vendor }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
