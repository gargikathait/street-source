export const MockDatabase = {
  vendors: [
    { id: 'abc123', name: 'Acme Corp', email: 'acme@example.com' },
    { id: 'xyz789', name: 'Beta Inc', email: 'beta@example.com' },
  ],

  getVendor(id: string) {
    return this.vendors.find(v => v.id === id) || null;
  },

  updateVendor(id: string, data: Partial<{ name: string; email: string }>) {
    const vendor = this.getVendor(id);
    if (!vendor) return null;
    Object.assign(vendor, data);
    return vendor;
  },
};
