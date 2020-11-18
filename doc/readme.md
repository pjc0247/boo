boo-batteries
====

`boo`의 딱 2개의 함수들로 상태 관리의 모든 기능을 구현합니다. 하지만, 개발 편의성을 위해 추가 유틸리티 함수들을 이용할 수 있습니다.<br>
이 함수들은 boo의 주요 기능이 아니고, 상태 관리보다는 코딩 스타일에 가깝습니다.<br>
선택적으로 사용하시면 됩니다.

useRemoteValue
----

`useRemoteValue`는 비동기 함수를 실행시켜 반환값을 가져와 저장합니다.<br>
apollo의 useQuery와 비슷하게 동작합니다.

```jsx
class UserService {
  async getMe() {
    return fetch('/me');
  }
}
```

```jsx
const user = useService(UserService);
const [me, refetch, hasValue] = useRemoteValue(user.getMe);
```


만약 비동기 함수에 파라미터가 있을 경우 아래와 같이 사용할 수 있습니다.

```jsx
class UserService {
  async getFoo(p1, p2) {
    /* ... */
  }
}
```
```jsx
const [p1, setP1] = useState(0);
const [p2, setP2] = useState(0);

const user = useService(UserService);
const [foo, refetch, hasValue] = useRemoteValue(() => user.getFoo(p1, p2), [p1, p2]);
```


useApi
----

`useApi`는 비동기 api를 원하는 시점에 호출하고, 결과 혹은 에러를 저장합니다. <br>
apollo의 useMutation과 비슷하게 동작합니다.

```jsx
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
