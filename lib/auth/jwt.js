const jwt = require('jsonwebtoken')

const jwtAccessSecret = process.env.JWT_ACCESS_SECRET
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET

const generateAccessToken = (user) => {
  return jwt.sign({ userId: user.id }, jwtAccessSecret, {
    expiresIn: '10m',
  })
}

const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user.id }, jwtRefreshSecret, {
    expiresIn: '7d',
  })
}

const decodeRefreshToken = (token) => {
  try {
    return jwt.verify(token, jwtRefreshSecret)
  } catch (error) {
    return null
  }
}

const decodeAccessToken = (token) => {
  try {
    return jwt.verify(token, jwtAccessSecret)
  } catch (error) {
    return null
  }
}

const generateTokens = (user) => {
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)
  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  }
}

module.exports = {
  decodeRefreshToken,
  decodeAccessToken,
  generateTokens,
}
