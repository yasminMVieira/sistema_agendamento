export interface Equipment {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  quantity?: number;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  availableEquipment: string[];
  description?: string;
  location?: string;
  isActive?: boolean;
}

export interface Reservation {
  id: string;
  userId: string;
  username: string;
  roomId: string;
  roomName: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  selectedEquipment: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReservationFormData {
  roomId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  selectedEquipment: string[];
}

export interface ReservationContextType {
  reservations: Reservation[];
  rooms: Room[];
  equipment: Equipment[];
  addReservation: (data: ReservationFormData) => Promise<boolean>;
  updateReservation: (id: string, data: ReservationFormData) => Promise<boolean>;
  deleteReservation: (id: string) => void;
  getReservationById: (id: string) => Reservation | undefined;
  isTimeSlotAvailable: (roomId: string, startTime: Date, endTime: Date, excludeId?: string) => boolean;
  // Admin functions
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => boolean;
  addEquipment: (equipment: Omit<Equipment, 'id'>) => void;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => boolean;
}
