import { MIN_RESERVATION_DURATION, MAX_RESERVATION_DURATION } from './constants';
import { getDurationInMinutes, isBeforeNow } from './dateHelpers';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('A senha deve ter pelo menos 6 caracteres');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateUsername = (username: string): boolean => {
  return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
};

export const validateReservationTime = (start: Date, end: Date): { valid: boolean; error?: string } => {
  if (isBeforeNow(start)) {
    return { valid: false, error: 'A data de início não pode ser no passado' };
  }

  if (end <= start) {
    return { valid: false, error: 'A data de término deve ser após a data de início' };
  }

  const duration = getDurationInMinutes(start, end);

  if (duration < MIN_RESERVATION_DURATION) {
    return { valid: false, error: `A duração mínima é de ${MIN_RESERVATION_DURATION} minutos` };
  }

  if (duration > MAX_RESERVATION_DURATION) {
    return { valid: false, error: `A duração máxima é de ${MAX_RESERVATION_DURATION / 60} horas` };
  }

  return { valid: true };
};
