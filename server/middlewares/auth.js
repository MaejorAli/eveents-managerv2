import jwt from 'jsonwebtoken';

const secret = process.env.SECRET;

const verifyToken = (req, res, next) => {
  const token = req.headers.auth || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(400).send({ error: 'Your session has expired,please login again to Events-Manager' });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    return res.status(403).send({ error: 'You have to login First' });
  }
};

export default verifyToken;
