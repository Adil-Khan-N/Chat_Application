export const createAuthSlice = (set) => ({
    userInfo: undefined,
    setUserInfo: (userInfo) => set({ userInfo }), // Changed setuserInfo to setUserInfo
  });
  