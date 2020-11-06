boo-batteries
====

`boo`의 모든 기능들은 2개의 함수로만 이루어져 있지만, 추가 유틸리티 함수들을 이용할 수 있습니다.<br>
이 함수들은 boo의 주요 기능이 아니므로 선택적으로 사용하면 됩니다.

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
