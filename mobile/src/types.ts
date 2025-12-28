export type UserRole = 'admin' | 'driver' | 'kitchen' | 'employee';

export interface User {
    id: string;
    name: string;
    role: UserRole;
    email: string;
}

export interface Order {
    id: string;
    customerName: string;
    address: string;
    items: number;
    status: 'Pending' | 'Preparing' | 'Ready' | 'En Route' | 'Delivered';
    specialInstructions?: string;
    eta?: string;
}

export interface KitchenItem {
    id: string;
    name: string;
    quantity: number;
    completed: number;
    unit: string;
    allergens?: string[];
    status: 'pending' | 'in-progress' | 'done';
}

export interface TimeEntry {
    id: string;
    userId: string;
    startTime: Date;
    endTime?: Date;
    status: 'active' | 'completed';
}
