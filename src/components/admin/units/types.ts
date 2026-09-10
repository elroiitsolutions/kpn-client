import { Block, Unit, Plot } from '@/components/admin/InventoryManager';

export interface AllocatingUnit {
  unitNumber: string;
  unitId?: string;
  blockId?: string;
  floorNumber?: number;
  plotId?: string;
  isPlot?: boolean;
  currentStatus: 'available' | 'booked' | 'sold';
  bookedTo?: {
    enquiryId?: string;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    action?: 'booked' | 'sold';
    allocatedAt?: string;
  };
  enquiries: any[];
}

export interface UnitFormData {
  unitNumber: string;
  bhk: number;
  size: number;
  facing: string;
  status: 'available' | 'booked' | 'sold';
}

export interface PlotFormData {
  plotNumber: string;
  size: number;
  facing: string;
  status: 'available' | 'booked' | 'sold';
}
