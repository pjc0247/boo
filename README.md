<p align="center">
<img src="vuvuzela.png" width="64" />
&nbsp;&nbsp;&nbsp;&nbsp;<img src="boojs.png" width="120" />
</p>
 
[Example](https://pjc0247.github.io/useService/)<br>
[Example Sourcecode](https://github.com/pjc0247/useService/blob/master/index.html#L14-L23)<br>
[Boo Batteries](doc/)<br>

A super tiny state management library that only contains 2 functions.

boo is
----
* Pure Javascript workflow, you don't need to learn library-specific flows. (such as `dispatch` and `reducer`)
* Everything works as expected.  (No hidden layers, No middlewares)
* Less re-render compared to `redux`.

Installation
----
```
yarn add boo-state
```

Overview
----
```js
class AuthService {
  get isLoggedIn() { return !isNil(this.token); }

  async login() {
    const resp = await fetch(/* ... */);
    
    // Below mutations automatically trigger components update
    this.user = resp.user;
    this.token = resp.token;
  }
}
```
```js
const AuthComponent = () => {
  const auth = useService(AuthService);
  
  const onClickLogin = (id, pw) => {
    auth.login(id, pw);
  };
  
  return (
    { auth.isLoggedIn && <LoginComponent onClickLogin={onClickLogin} /> }
    { !auth.isLoggedIn && <UserProfileComponent /> }
  ); 
};
```

getService
----
You can retrive other service's instances via `getService`.
```js
class PostService {
  async write() {
    const auth = getService(AuthService);
    
    if (auth.isLoggedIn === false) {
      alert('You must sign-in before you writing a post!');
      return;
    }
    /* ... */
  }
}
```

Error Handling
----

using __catch__

```js
const onClickLogin = async (id, pw) => {
  try {
    await auth.login(id, pw);
  } catch(e) {
    /* do something */
  }
};
```

using __useApi__

```js
const auth = useService(AuthService);
const login = useApi(auth.login);

const onClickLogin = (id, pw) => {
  login(id, pw);
};

return (
  { login.isFetching && "Please wait..." }
  { login.loginResult && "You are successfully logged in" }
  { login.error && "Login failed" }
);
```


변경 감지
----
`useService`는 자동으로 각 컴포넌트가 어떤 property를 구독하는지에 대한 Map을 생성합니다.<br>
이는 특정 프로퍼티가 변경되었을 때, 모든 컴포넌트를 다시 렌더링하는 대신 해당 프로퍼티를 사용하는 컴포넌트만 업데이트 할 수 있도록 해줍니다.

```js
class UserService {
  changeNickname(newNickname) {
    // 이 함수는 UserStatusComponent의 re-render를 실행하지 않습니다.
    this.nickname = newNickname;
  }
  setUserStatus(newStatus) {
    // 같은 원리로, 이 함수는 UserProfileComponent re-render를 실행하지 않습니다.
    this.status = newStatus;
  }
}
```
```js
const UserProfileComponent = () => {
  const user = useService(UserService);
  return (
    <div>
      Nickname: {user.nickname}
    </div>
  );
};
```
```js
const UserStatusComponent = () => {
  const user = useService(UserService);
  return (
    <div>
      Status: {user.status}
      
      <div>
        Set As
        <button onClick={() => user.setUserStatus('online')}> ONLINE </button>
        <button onClick={() => user.setUserStatus('away')}> AWAY </button>
      </div>
    </div>
  );
};
```

### 구독 시점
`useService`는 오직 렌더링 과정에서 발생한 읽기 작업만 구독으로 간주합니다.<br>
아래 코드에서 `isLoggedIn`과 `nickname`은 렌더링 이후에 발생할 작업들이기 때문에 해당 프로퍼티가 바뀌어도 컴포넌트가 다시 렌더링되지 않습니다.
```js
const AuthComponent = () => {
  const user = useService(UserService);
  
  const onClickLogin = (id, pw) => {
    if (user.isLoggedIn) return;
    login(id, pw);
  };
  
  useEffect(() => {
    console.log(user.nickname);
  }, []);
  
  return (
    <div>
      /* ... */
    </div>
  );
};
```

### 구독 갱신
컴포넌트의 로컬 `state`에 따라서 구독하는 프로퍼티가 달라지는 경우가 있습니다.<br>
이전에 구독했던 프로퍼티가 더 이상 필요하지 않을 수도 있고, 새로운 프로퍼티를 구독해야할 경우도 있습니다.<br>
`useService`는 가장 마지막 렌더링 작업에서 요청된 프로퍼티들만을 기억하기 때문에 이러한 작업은 자동으로 처리됩니다.
```js
const Foo = () => {
  const user = useService(UserService);
  const [mode, setMode] = useState(0);
  
  if (mode === 0) return (<div>{user.nickname}</div>);
  else if (mode === 1) return (<div>{user.status}</div>);
  else return (<div>{user.createdAt}</div>);
};
```

### Peek

만약 프로퍼티를 구독하고자 하는게 아니라, 단순히 읽고 싶으면 `__peek` 메소드를 사용합니다.
```js
const user = useService(UserService);
const status = user.__peek('status');
```

__주의__<br>
`__peek`은 1회성 동작이며, 컴포넌트 내에 다른 읽기 동작이 있을 경우 최종적으로는 해당 컴포넌트는 `status`를 구독하게 됩니다.
```js
const user = useService(UserService);
const status = user.__peek('status');

return (
  <div>{user.status}</div>
)
```
