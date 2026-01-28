import { format, differenceInMinutes, addDays as addDaysFns, isSameDay as isSameDayFns } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
};

export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm', { locale: ptBR });
};

export const formatDateTime = (date: Date): string => {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
};

export const isBeforeNow = (date: Date): boolean => {
  return date < new Date();
};

export const getDurationInMinutes = (start: Date, end: Date): number => {
  return differenceInMinutes(end, start);
};

export const addDays = (date: Date, days: number): Date => {
  return addDaysFns(date, days);
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return isSameDayFns(date1, date2);
};

export const toLocalISOString = (date: Date): string => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};
