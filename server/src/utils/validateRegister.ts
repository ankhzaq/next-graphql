import { UsernamePasswordInput } from '../resolvers/UsernamePasswordInput';

export const validateRegister = (options: UsernamePasswordInput) => {
  const { email, username, password } = options;
  if (!email.includes('@')) {
    return {
      errors: [{
        field: 'email',
        message: 'Invalid email'
      }]
    }
  }
  if (!username || username.length < 2) {
    return {
      errors: [{
        field: 'username',
        message: 'length must be greater than two'
      }]
    }
  }

  if (username.includes('@')) {
    return {
      errors: [{
        field: 'username',
        message: 'cannot include an @'
      }]
    }
  }

  if (!password || password.length < 3) {
    return {
      errors: [{
        field: 'password',
        message: 'length must be greater than three'
      }]
    }
  }
  return false;
}
