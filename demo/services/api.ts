import UserService from './user';

class Api {
  constructor(private endpoint: string) {
  }
  
  get(path: string) {
    const resp = await fetch(path, {
      headers: this.getCommomHeaders(),
    });
    return await resp.json();
  }
  post(path: string, params: any) {
    const resp = await fetch(path, {
      method: 'POST',
      headers: this.getCommomHeaders(),
      body: JSON.stringify(params),
    });
    return await resp.json();
  }
  
  private getCommonHeaders() {
    const user = getService(UserService);
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
    };
  }
};

const api = new Api('http://boo.boo.boo/');
export default api;
