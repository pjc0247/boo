const App({
}) => {
  const userService = useService(UserService);
  const [profile] = useRemoteValue(userService.getProfile, [userService.isLoggedIn]);
  
  return (
    <>
      {!!profile && (
        <div>
          Hello, {profile.name}!
        </div>
      )}
      {!profile && (
        <button onClick={() => userService.login('a', 'b')}>
          LogIn
        </button>
      )}
    </>
  );
};
