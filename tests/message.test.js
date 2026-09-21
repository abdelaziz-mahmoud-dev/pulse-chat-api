const { validateRegisterInput } = require('../src/utils/validators');

describe('validateRegisterInput', () => {
  test('returns errors for empty fields', () => {
    const errors = validateRegisterInput({ username: '', email: '', password: '' });
    expect(errors.length).toBeGreaterThan(0);
  });

  test('returns error for short username', () => {
    const errors = validateRegisterInput({
      username: 'ab',
      email: 'test@test.com',
      password: '123456',
    });
    expect(errors).toContain('Username must be at least 3 characters');
  });

  test('returns error for invalid email', () => {
    const errors = validateRegisterInput({
      username: 'abdelaziz',
      email: 'not-an-email',
      password: '123456',
    });
    expect(errors).toContain('Valid email is required');
  });

  test('returns error for short password', () => {
    const errors = validateRegisterInput({
      username: 'abdelaziz',
      email: 'test@test.com',
      password: '123',
    });
    expect(errors).toContain('Password must be at least 6 characters');
  });

  test('returns no errors for valid input', () => {
    const errors = validateRegisterInput({
      username: 'abdelaziz',
      email: 'test@test.com',
      password: '123456',
    });
    expect(errors.length).toBe(0);
  });
});