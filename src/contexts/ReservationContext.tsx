import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  Reservation,
  Room,
  Equipment,
  ReservationFormData,
  ReservationContextType,
} from '../types/reservation.types';
import {
  STORAGE_KEYS,
  getFromStorage,
  saveToStorage,
  DEFAULT_ROOMS,
  DEFAULT_EQUIPMENT,
} from '../utils/localStorage';
import { useAuth } from '../hooks/useAuth';

export const ReservationContext = createContext<ReservationContextType | undefined>(
  undefined
);

interface ReservationProviderProps {
  children: ReactNode;
}

export const ReservationProvider = ({ children }: ReservationProviderProps) => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    // Load data from localStorage on mount
    const storedReservations = getFromStorage<Reservation[]>(
      STORAGE_KEYS.RESERVATIONS,
      []
    );
    const storedRooms = getFromStorage<Room[]>(
      STORAGE_KEYS.ROOMS,
      DEFAULT_ROOMS
    );
    const storedEquipment = getFromStorage<Equipment[]>(
      STORAGE_KEYS.EQUIPMENT,
      DEFAULT_EQUIPMENT
    );

    setReservations(storedReservations);
    setRooms(storedRooms);
    setEquipment(storedEquipment);

    // Initialize defaults if empty
    if (storedRooms.length === 0) {
      saveToStorage(STORAGE_KEYS.ROOMS, DEFAULT_ROOMS);
      setRooms(DEFAULT_ROOMS);
    }
    if (storedEquipment.length === 0) {
      saveToStorage(STORAGE_KEYS.EQUIPMENT, DEFAULT_EQUIPMENT);
      setEquipment(DEFAULT_EQUIPMENT);
    }
  }, []);

  const isTimeSlotAvailable = (
    roomId: string,
    startTime: Date,
    endTime: Date,
    excludeId?: string
  ): boolean => {
    const roomReservations = reservations.filter(
      (res) => res.roomId === roomId && res.id !== excludeId
    );

    for (const reservation of roomReservations) {
      const existingStart = new Date(reservation.startTime);
      const existingEnd = new Date(reservation.endTime);

      // Check for overlap: new start < existing end AND new end > existing start
      const hasOverlap = startTime < existingEnd && endTime > existingStart;

      if (hasOverlap) {
        return false;
      }
    }

    return true;
  };

  const addReservation = async (
    data: ReservationFormData
  ): Promise<boolean> => {
    try {
      if (!user) {
        return false;
      }

      // Check if time slot is available
      if (
        !isTimeSlotAvailable(data.roomId, data.startTime, data.endTime)
      ) {
        return false;
      }

      const room = rooms.find((r) => r.id === data.roomId);
      if (!room) {
        return false;
      }

      const newReservation: Reservation = {
        id: crypto.randomUUID(),
        userId: user.id,
        username: user.username,
        roomId: data.roomId,
        roomName: room.name,
        title: data.title,
        description: data.description,
        startTime: data.startTime.toISOString(),
        endTime: data.endTime.toISOString(),
        selectedEquipment: data.selectedEquipment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedReservations = [...reservations, newReservation];
      setReservations(updatedReservations);
      saveToStorage(STORAGE_KEYS.RESERVATIONS, updatedReservations);
      return true;
    } catch (error) {
      console.error('Error adding reservation:', error);
      return false;
    }
  };

  const updateReservation = async (
    id: string,
    data: ReservationFormData
  ): Promise<boolean> => {
    try {
      if (!user) {
        return false;
      }

      const existingReservation = reservations.find((r) => r.id === id);
      if (!existingReservation) {
        return false;
      }

      // Check if user owns the reservation
      if (existingReservation.userId !== user.id) {
        return false;
      }

      // Check if time slot is available (excluding current reservation)
      if (
        !isTimeSlotAvailable(data.roomId, data.startTime, data.endTime, id)
      ) {
        return false;
      }

      const room = rooms.find((r) => r.id === data.roomId);
      if (!room) {
        return false;
      }

      const updatedReservation: Reservation = {
        ...existingReservation,
        roomId: data.roomId,
        roomName: room.name,
        title: data.title,
        description: data.description,
        startTime: data.startTime.toISOString(),
        endTime: data.endTime.toISOString(),
        selectedEquipment: data.selectedEquipment,
        updatedAt: new Date().toISOString(),
      };

      const updatedReservations = reservations.map((r) =>
        r.id === id ? updatedReservation : r
      );
      setReservations(updatedReservations);
      saveToStorage(STORAGE_KEYS.RESERVATIONS, updatedReservations);
      return true;
    } catch (error) {
      console.error('Error updating reservation:', error);
      return false;
    }
  };

  const deleteReservation = (id: string) => {
    if (!user) {
      return;
    }

    const reservation = reservations.find((r) => r.id === id);
    if (!reservation || reservation.userId !== user.id) {
      return;
    }

    const updatedReservations = reservations.filter((r) => r.id !== id);
    setReservations(updatedReservations);
    saveToStorage(STORAGE_KEYS.RESERVATIONS, updatedReservations);
  };

  const getReservationById = (id: string): Reservation | undefined => {
    return reservations.find((r) => r.id === id);
  };

  // Admin functions for rooms
  const addRoom = (roomData: Omit<Room, 'id'>) => {
    const newRoom: Room = {
      ...roomData,
      id: crypto.randomUUID(),
      isActive: true,
    };
    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);
    saveToStorage(STORAGE_KEYS.ROOMS, updatedRooms);
  };

  const updateRoom = (id: string, roomData: Partial<Room>) => {
    const updatedRooms = rooms.map((r) =>
      r.id === id ? { ...r, ...roomData } : r
    );
    setRooms(updatedRooms);
    saveToStorage(STORAGE_KEYS.ROOMS, updatedRooms);
  };

  const deleteRoom = (id: string): boolean => {
    // Check if room has reservations
    const hasReservations = reservations.some((r) => r.roomId === id);
    if (hasReservations) {
      return false;
    }
    const updatedRooms = rooms.filter((r) => r.id !== id);
    setRooms(updatedRooms);
    saveToStorage(STORAGE_KEYS.ROOMS, updatedRooms);
    return true;
  };

  // Admin functions for equipment
  const addEquipment = (equipmentData: Omit<Equipment, 'id'>) => {
    const newEquipment: Equipment = {
      ...equipmentData,
      id: crypto.randomUUID(),
    };
    const updatedEquipment = [...equipment, newEquipment];
    setEquipment(updatedEquipment);
    saveToStorage(STORAGE_KEYS.EQUIPMENT, updatedEquipment);
  };

  const updateEquipment = (id: string, equipmentData: Partial<Equipment>) => {
    const updatedEquipment = equipment.map((e) =>
      e.id === id ? { ...e, ...equipmentData } : e
    );
    setEquipment(updatedEquipment);
    saveToStorage(STORAGE_KEYS.EQUIPMENT, updatedEquipment);
  };

  const deleteEquipment = (id: string): boolean => {
    // Check if equipment is used in any room
    const isUsedInRoom = rooms.some((r) => r.availableEquipment.includes(id));
    if (isUsedInRoom) {
      return false;
    }
    const updatedEquipment = equipment.filter((e) => e.id !== id);
    setEquipment(updatedEquipment);
    saveToStorage(STORAGE_KEYS.EQUIPMENT, updatedEquipment);
    return true;
  };

  const value: ReservationContextType = {
    reservations,
    rooms,
    equipment,
    addReservation,
    updateReservation,
    deleteReservation,
    getReservationById,
    isTimeSlotAvailable,
    addRoom,
    updateRoom,
    deleteRoom,
    addEquipment,
    updateEquipment,
    deleteEquipment,
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
};
