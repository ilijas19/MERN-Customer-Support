const createTokenUser = (user) => {
  return {
    userId: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    profilePicture: user.profilePicture,
  };
};

export default createTokenUser;
