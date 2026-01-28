import type { User } from '../types/auth.types';
import type { Room, Equipment, Reservation } from '../types/reservation.types';

export const STORAGE_KEYS = {
  USERS: 'room_reservation_users',
  CURRENT_USER: 'room_reservation_current_user',
  RESERVATIONS: 'room_reservation_reservations',
  ROOMS: 'room_reservation_rooms',
  EQUIPMENT: 'room_reservation_equipment',
} as const;

export const DEFAULT_ROOMS: Room[] = [
  {
    id: '1',
    name: 'Sala de Conferência A',
    capacity: 10,
    availableEquipment: ['1', '2', '3']
  },
  {
    id: '2',
    name: 'Sala de Conferência B',
    capacity: 20,
    availableEquipment: ['1', '2', '3', '4']
  },
  {
    id: '3',
    name: 'Sala de Treinamento',
    capacity: 30,
    availableEquipment: ['1', '2', '3', '4', '5']
  },
  {
    id: '4',
    name: 'Sala de Reunião 1',
    capacity: 6,
    availableEquipment: ['2', '3']
  },
];

export const DEFAULT_EQUIPMENT: Equipment[] = [
  { id: '1', name: 'Datashow/Projetor', icon: 'Projector' },
  { id: '2', name: 'Tela', icon: 'Monitor' },
  { id: '3', name: 'Computador', icon: 'Laptop' },
  { id: '4', name: 'Quadro Branco', icon: 'Presentation' },
  { id: '5', name: 'Sistema de Videoconferência', icon: 'Video' },
];

export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
};

export const removeFromStorage = (key: string): void => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
  }
};

export const initializeStorage = (): void => {
  // Initialize users if not exists
  const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
  if (users.length === 0) {
    saveToStorage(STORAGE_KEYS.USERS, []);
  }

  // Initialize rooms if not exists
  const rooms = getFromStorage<Room[]>(STORAGE_KEYS.ROOMS, []);
  if (rooms.length === 0) {
    saveToStorage(STORAGE_KEYS.ROOMS, DEFAULT_ROOMS);
  }

  // Initialize equipment if not exists
  const equipment = getFromStorage<Equipment[]>(STORAGE_KEYS.EQUIPMENT, []);
  if (equipment.length === 0) {
    saveToStorage(STORAGE_KEYS.EQUIPMENT, DEFAULT_EQUIPMENT);
  }

  // Initialize reservations if not exists
  const reservations = getFromStorage<Reservation[]>(STORAGE_KEYS.RESERVATIONS, []);
  if (reservations.length === 0) {
    saveToStorage(STORAGE_KEYS.RESERVATIONS, []);
  }
};
