import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import models from '../models';

const { Users } = models;

const secret = process.env.SECRET;
export default (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    Users.findOne({
      where: {
        email: 'alishaibu2002@gmail.com',
      },
    })
      .then((user) => {
        if (user) {
          return res.status(400).send({ error: 'Another user with this email already exists' });
        }
      })
      .catch(error => res.status(500).send({ error: error.message }));
    Users
      .create({
        email: 'alishaibu2002@gmail.com',
        firstname: 'Ali',
        lastname: 'Shaibu',
        password: hash,
        role: 'SuperAdmin',
      })
      .then((superAdmin) => {
        const payload = {
          userId: superAdmin.id,
          firstname: superAdmin.firstname,
          lastname: superAdmin.lastname,
          role: superAdmin.role,
        };
        const token = jwt.sign(payload, secret, {
          expiresIn: '10h',
        });
        return res.status(201).send({ message: 'SuperAdmin created', token });
      })
      .catch(error => res.status(500).send({ error: error.message }));
  });
};
