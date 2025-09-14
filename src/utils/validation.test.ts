import { describe, it, expect } from 'vitest';
import { shuttleSearchSchema } from './validation';

describe('shuttleSearchSchema', () => {
  it('should validate a correct form data', () => {
    const validData = {
      name: 'John Doe',
      origin: 'Jakarta',
      destination: 'Bandung',
      departureDate: new Date().toISOString().split('T')[0], // today's date
    };

    const result = shuttleSearchSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should invalidate when origin and destination are the same', () => {
    const invalidData = {
      name: 'John Doe',
      origin: 'Jakarta',
      destination: 'Jakarta',
      departureDate: new Date().toISOString().split('T')[0],
    };

    const result = shuttleSearchSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('destination');
      expect(result.error.issues[0].message).toBe('Kota asal dan tujuan tidak boleh sama');
    }
  });

  it('should invalidate when departureDate is in the past', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const invalidData = {
      name: 'John Doe',
      origin: 'Jakarta',
      destination: 'Bandung',
      departureDate: pastDate.toISOString().split('T')[0],
    };

    const result = shuttleSearchSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.message === 'Tanggal berangkat harus hari ini atau di masa depan')).toBe(true);
    }
  });

  it('should validate when departureDate is in the future', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const validData = {
      name: 'John Doe',
      origin: 'Jakarta',
      destination: 'Bandung',
      departureDate: futureDate.toISOString().split('T')[0],
    };

    const result = shuttleSearchSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should invalidate when name is empty', () => {
    const invalidData = {
      name: '',
      origin: 'Jakarta',
      destination: 'Bandung',
      departureDate: new Date().toISOString().split('T')[0],
    };

    const result = shuttleSearchSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.path.includes('name'))).toBe(true);
    }
  });

  it('should invalidate when origin is empty', () => {
    const invalidData = {
      name: 'John Doe',
      origin: '',
      destination: 'Bandung',
      departureDate: new Date().toISOString().split('T')[0],
    };

    const result = shuttleSearchSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.path.includes('origin'))).toBe(true);
    }
  });

  it('should invalidate when destination is empty', () => {
    const invalidData = {
      name: 'John Doe',
      origin: 'Jakarta',
      destination: '',
      departureDate: new Date().toISOString().split('T')[0],
    };

    const result = shuttleSearchSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.path.includes('destination'))).toBe(true);
    }
  });

  it('should invalidate when departureDate is empty', () => {
    const invalidData = {
      name: 'John Doe',
      origin: 'Jakarta',
      destination: 'Bandung',
      departureDate: '',
    };

    const result = shuttleSearchSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.path.includes('departureDate'))).toBe(true);
    }
  });
});
