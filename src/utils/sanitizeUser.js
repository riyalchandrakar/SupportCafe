// src/utils/sanitizeUser.js
export const sanitizeUser = (user) => {
    if (!user) return null
  
    const plainUser = {
      ...user,
      _id: user._id?.toString(),
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
    }
  
    // Remove any Mongoose version key (__v)
    if ('__v' in plainUser) delete plainUser.__v
  
    return plainUser
  }
  