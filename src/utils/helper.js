export const validateUserData = (data) => {
    const { email, password, role, name, status } = data;
    if (!email || !password || !role || !name || !status) {
      throw new Error('All fields are required.');
    }
};