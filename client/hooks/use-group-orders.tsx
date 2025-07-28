import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";

interface GroupOrderParticipant {
  vendorId: string;
  vendorName: string;
  businessName: string;
  items: Array<{
    materialId: string;
    materialName: string;
    quantity: number;
    unit: string;
    price: number;
  }>;
  totalAmount: number;
  joinedAt: string;
}

interface GroupOrder {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  targetAmount: number;
  currentAmount: number;
  participants: GroupOrderParticipant[];
  status: 'open' | 'closed' | 'confirmed' | 'delivered';
  expiresAt: string;
  deliveryLocation: string;
  supplierId: string;
  supplierName: string;
  materials: Array<{
    materialId: string;
    materialName: string;
    unit: string;
    minQuantity: number;
    pricePerUnit: number;
    totalQuantityNeeded: number;
    currentQuantity: number;
  }>;
  createdAt: string;
  minParticipants: number;
  maxParticipants: number;
  groupDiscount: number; // Percentage discount for group orders
}

interface GroupOrdersContextType {
  groupOrders: GroupOrder[];
  myGroupOrders: GroupOrder[];
  createGroupOrder: (orderData: Partial<GroupOrder>) => Promise<GroupOrder>;
  joinGroupOrder: (orderId: string, items: GroupOrderParticipant['items']) => Promise<void>;
  leaveGroupOrder: (orderId: string) => Promise<void>;
  fetchGroupOrders: () => Promise<void>;
  getRecommendedGroupOrders: () => GroupOrder[];
}

const GroupOrdersContext = createContext<GroupOrdersContextType | undefined>(undefined);

export function GroupOrdersProvider({ children }: { children: ReactNode }) {
  const [groupOrders, setGroupOrders] = useState<GroupOrder[]>([]);
  const [myGroupOrders, setMyGroupOrders] = useState<GroupOrder[]>([]);
  const { toast } = useToast();
  const { t } = useLanguage();

  const vendorId = "vendor_001"; // Current user
  const vendorName = "Radhika Shukla";
  const businessName = "Shukla Street Foods";

  useEffect(() => {
    fetchGroupOrders();
  }, []);

  const generateId = () => `GRP${Date.now()}${Math.random().toString(36).substr(2, 6)}`;

  const createGroupOrder = async (orderData: Partial<GroupOrder>): Promise<GroupOrder> => {
    const groupOrder: GroupOrder = {
      id: generateId(),
      title: orderData.title || "",
      description: orderData.description || "",
      creatorId: vendorId,
      creatorName: vendorName,
      targetAmount: orderData.targetAmount || 0,
      currentAmount: 0,
      participants: [],
      status: 'open',
      expiresAt: orderData.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      deliveryLocation: orderData.deliveryLocation || "",
      supplierId: orderData.supplierId || "",
      supplierName: orderData.supplierName || "",
      materials: orderData.materials || [],
      createdAt: new Date().toISOString(),
      minParticipants: orderData.minParticipants || 3,
      maxParticipants: orderData.maxParticipants || 10,
      groupDiscount: orderData.groupDiscount || 10 // 10% group discount
    };

    try {
      // Try to save to API
      const response = await fetch('/api/group-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupOrder)
      });

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        const result = await response.json();
        if (result.success) {
          setGroupOrders(prev => [groupOrder, ...prev]);
          setMyGroupOrders(prev => [groupOrder, ...prev]);

          toast({
            title: "Group Order Created",
            description: `Group order "${groupOrder.title}" has been created successfully`
          });

          return groupOrder;
        }
      }
    } catch (error) {
      console.error('Group orders API not available, saving locally:', error);
    }

    // Fallback: Save locally
    setGroupOrders(prev => [groupOrder, ...prev]);
    setMyGroupOrders(prev => [groupOrder, ...prev]);
    
    toast({
      title: "Group Order Created",
      description: `Group order "${groupOrder.title}" has been created successfully`
    });
    
    return groupOrder;
  };

  const joinGroupOrder = async (orderId: string, items: GroupOrderParticipant['items']) => {
    const order = groupOrders.find(o => o.id === orderId);
    if (!order) {
      toast({
        title: "Error",
        description: "Group order not found",
        variant: "destructive"
      });
      return;
    }

    if (order.participants.some(p => p.vendorId === vendorId)) {
      toast({
        title: "Already Joined",
        description: "You are already part of this group order",
        variant: "destructive"
      });
      return;
    }

    if (order.participants.length >= order.maxParticipants) {
      toast({
        title: "Group Full",
        description: "This group order is already full",
        variant: "destructive"
      });
      return;
    }

    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    
    const participant: GroupOrderParticipant = {
      vendorId,
      vendorName,
      businessName,
      items,
      totalAmount,
      joinedAt: new Date().toISOString()
    };

    try {
      const response = await fetch(`/api/group-orders/${orderId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(participant)
      });

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        const result = await response.json();
        if (result.success) {
          updateGroupOrderAfterJoin(orderId, participant);
          return;
        }
      }
    } catch (error) {
      console.error('Group orders API not available, updating locally:', error);
    }

    // Fallback: Update locally
    updateGroupOrderAfterJoin(orderId, participant);
  };

  const updateGroupOrderAfterJoin = (orderId: string, participant: GroupOrderParticipant) => {
    setGroupOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedOrder = {
          ...order,
          participants: [...order.participants, participant],
          currentAmount: order.currentAmount + participant.totalAmount
        };
        
        // Auto-confirm if minimum participants reached
        if (updatedOrder.participants.length >= order.minParticipants && 
            updatedOrder.currentAmount >= order.targetAmount) {
          updatedOrder.status = 'confirmed';
        }
        
        return updatedOrder;
      }
      return order;
    }));

    setMyGroupOrders(prev => {
      const order = groupOrders.find(o => o.id === orderId);
      if (order && !prev.some(o => o.id === orderId)) {
        return [{ ...order, participants: [...order.participants, participant] }, ...prev];
      }
      return prev.map(o => o.id === orderId ? 
        { ...o, participants: [...o.participants, participant] } : o
      );
    });

    toast({
      title: "Successfully Joined",
      description: "You've joined the group order successfully"
    });
  };

  const leaveGroupOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/group-orders/${orderId}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId })
      });

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        const result = await response.json();
        if (result.success) {
          updateGroupOrderAfterLeave(orderId);
          return;
        }
      }
    } catch (error) {
      console.error('Group orders API not available, updating locally:', error);
    }

    // Fallback: Update locally
    updateGroupOrderAfterLeave(orderId);
  };

  const updateGroupOrderAfterLeave = (orderId: string) => {
    setGroupOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const participant = order.participants.find(p => p.vendorId === vendorId);
        return {
          ...order,
          participants: order.participants.filter(p => p.vendorId !== vendorId),
          currentAmount: order.currentAmount - (participant?.totalAmount || 0)
        };
      }
      return order;
    }));

    setMyGroupOrders(prev => prev.filter(order => order.id !== orderId));

    toast({
      title: "Left Group Order",
      description: "You've left the group order"
    });
  };

  const fetchGroupOrders = async () => {
    try {
      const response = await fetch('/api/group-orders');

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        if (data.success) {
          setGroupOrders(data.data);
          setMyGroupOrders(data.data.filter((order: GroupOrder) =>
            order.creatorId === vendorId ||
            order.participants.some(p => p.vendorId === vendorId)
          ));
          return;
        }
      }
    } catch (error) {
      console.error('Group orders API not available, using mock data:', error);
    }

    // Fallback: Use mock data
    const mockGroupOrders: GroupOrder[] = [
      {
        id: 'GRP001',
        title: 'Bulk Rice Order - Karol Bagh Area',
        description: 'Group order for premium basmati rice. Get 15% discount on bulk orders!',
        creatorId: 'vendor_002',
        creatorName: 'Amit Kumar',
        targetAmount: 5000,
        currentAmount: 3200,
        participants: [
          {
            vendorId: 'vendor_002',
            vendorName: 'Amit Kumar',
            businessName: 'Kumar Chaat Corner',
            items: [
              {
                materialId: '1',
                materialName: 'Rice (Basmati)',
                quantity: 25,
                unit: 'kg',
                price: 78
              }
            ],
            totalAmount: 1950,
            joinedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            vendorId: 'vendor_003',
            vendorName: 'Priya Sharma',
            businessName: 'Sharma Snacks',
            items: [
              {
                materialId: '1',
                materialName: 'Rice (Basmati)',
                quantity: 16,
                unit: 'kg',
                price: 78
              }
            ],
            totalAmount: 1248,
            joinedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ],
        status: 'open',
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        deliveryLocation: 'Karol Bagh Market',
        supplierId: 'SUP001',
        supplierName: 'Mumbai Grains Wholesale',
        materials: [
          {
            materialId: '1',
            materialName: 'Rice (Basmati)',
            unit: 'kg',
            minQuantity: 50,
            pricePerUnit: 78,
            totalQuantityNeeded: 100,
            currentQuantity: 41
          }
        ],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        minParticipants: 3,
        maxParticipants: 8,
        groupDiscount: 15
      },
      {
        id: 'GRP002',
        title: 'Fresh Vegetables - Weekly Order',
        description: 'Weekly group order for fresh vegetables. Same day delivery!',
        creatorId: 'vendor_004',
        creatorName: 'Rajesh Gupta',
        targetAmount: 2000,
        currentAmount: 800,
        participants: [
          {
            vendorId: 'vendor_004',
            vendorName: 'Rajesh Gupta',
            businessName: 'Gupta Food Stall',
            items: [
              {
                materialId: '2',
                materialName: 'Potatoes',
                quantity: 10,
                unit: 'kg',
                price: 25
              },
              {
                materialId: '3',
                materialName: 'Onions',
                quantity: 8,
                unit: 'kg',
                price: 35
              }
            ],
            totalAmount: 530,
            joinedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ],
        status: 'open',
        expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        deliveryLocation: 'Central Delhi',
        supplierId: 'SUP004',
        supplierName: 'Delhi Fresh Vegetables',
        materials: [
          {
            materialId: '2',
            materialName: 'Potatoes',
            unit: 'kg',
            minQuantity: 20,
            pricePerUnit: 25,
            totalQuantityNeeded: 50,
            currentQuantity: 18
          },
          {
            materialId: '3',
            materialName: 'Onions',
            unit: 'kg',
            minQuantity: 15,
            pricePerUnit: 35,
            totalQuantityNeeded: 40,
            currentQuantity: 12
          }
        ],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        minParticipants: 4,
        maxParticipants: 10,
        groupDiscount: 12
      }
    ];

    setGroupOrders(mockGroupOrders);
    setMyGroupOrders(mockGroupOrders.filter(order => 
      order.creatorId === vendorId || 
      order.participants.some(p => p.vendorId === vendorId)
    ));
  };

  const getRecommendedGroupOrders = () => {
    return groupOrders.filter(order => 
      order.status === 'open' && 
      !order.participants.some(p => p.vendorId === vendorId) &&
      order.creatorId !== vendorId
    ).slice(0, 3);
  };

  return (
    <GroupOrdersContext.Provider value={{
      groupOrders,
      myGroupOrders,
      createGroupOrder,
      joinGroupOrder,
      leaveGroupOrder,
      fetchGroupOrders,
      getRecommendedGroupOrders
    }}>
      {children}
    </GroupOrdersContext.Provider>
  );
}

export function useGroupOrders() {
  const context = useContext(GroupOrdersContext);
  if (context === undefined) {
    throw new Error('useGroupOrders must be used within a GroupOrdersProvider');
  }
  return context;
}
