import axios from 'axios';

// Types cho API
export interface RegisterUserPayload {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
}

// Base URL cho MockAPI
const API_BASE_URL = 'https://68aed258b91dfcdd62ba657c.mockapi.io';

// Service để lấy tất cả users từ API
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách users:', error);
    return [];
  }
};

// Service để kiểm tra email đã tồn tại
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const users = await getAllUsers();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
  } catch (error) {
    console.error('Lỗi khi kiểm tra email:', error);
    return false;
  }
};

// Service để đăng nhập user
export async function loginUser(email: string, password: string): Promise<User | null> {
  try {
    // Lấy tất cả users và tìm user có email khớp
    const users = await getAllUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user && user.password === password) {
      return user;
    }
    return null;
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    return null;
  }
}

// Service để đăng ký user
export const registerUser = async (data: RegisterUserPayload): Promise<User> => {
  try {
    const response = await axios.post<User>(`${API_BASE_URL}/users`, {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: data.role,
      createdAt: new Date().toISOString()
    });
    
    return response.data;
  } catch (error) {
    // Log lỗi để debug
    console.error('Lỗi khi đăng ký user:', error);
    
    // Throw lỗi để component có thể xử lý
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký');
    }
    
    throw new Error('Có lỗi không xác định xảy ra');
  }
};
