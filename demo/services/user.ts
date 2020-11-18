import api from './api';

class UserService {
  token: string;
  user: any; // 데모앱이라 실제 User 정의는 없음

  async login(id, password) {
    const {
      user,
      token,
    } = api.post('/login', {
       id,
       password,
    });
    
    this.user = user;
    this.token = token;
  }
  
  async getProfile() {
    return api.get('/me');
  }
}
