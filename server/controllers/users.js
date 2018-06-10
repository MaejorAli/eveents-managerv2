import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import models from '../models';
import createAdmin from '../middlewares/admin';

const secret = process.env.SECRET;


const { Users } = models;


class User {
/*
 * SignUp a User
 * @param {object} req The request body of the request.
 * @param {object} res The response body.
 * @returns {object} res.
 */
  static signup(req, res) {
    const {
      firstname,
      lastname,
      email,
    } = req.body;

    // check if another user with same mail already exists
    Users
      .findOne({
        where: {
          email: email.trim(),
        },
      })
      .then((user) => {
        if (user) {
          return res.status(400).send({ error: 'Another user with this email already exists' });
        }
      })
      .catch(error => res.status(500).send({ error: error.message }));

    if (email === 'alishaibu2002@gmail.com') {
      return createAdmin(req, res);
    }
    // creates a User,generate a token and hash the password
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return res.status(500).send({ error: err.message });
      }
      const password = hash;
      return Users
        .create({
          firstname,
          lastname,
          email,
          password,
        })
        .then((user) => {
          const payload = {
            userId: user.id,
            role: user.role,
            firstname,
            lastname,
          };
          const token = jwt.sign(payload, secret, {
            expiresIn: '10h', // expires in 1 hours
          });
          return res.status(201).send({ message: 'You have successfully signed up', token, user });
        })
        .catch(error => res.status(500).send({ error: error.message }));
    });
  }
  /**
 * SignIn a User
 * @param {object} req The request body of the request.
 * @param {object} res The response body.
 * @returns {object} res.
 */
  static signin(req, res) {
    const {
      email,
      password,
    } = req.body;

    return Users
      .findOne({
        where: {
          email: email.trim(),
        },
      })
      .then((user) => {
        if (!user) {
          return res.status(400).send({ error: 'Invalid email or password' });
        }
        return bcrypt.compare(password, user.password, (err, response) => {
          if (response) {
            const payload = {
              userId: user.id,
              firstname: user.firstname,
              lastname: user.lastname,
              role: user.role,
            };
            const token = jwt.sign(payload, secret, {
              expiresIn: '10h', // expires in 1 hours
            });
            return res.status(200).send({ message: 'You have successfully logged in', token, user });
          }
          return res.status(400).send({ error: 'Invalid email or password' });
        });
      })
      .catch(() => res.status(500).send({ error: 'an error occurred' }));
  }


  static becomeAdmin(req, res) {
    if (req.decoded.role !== 'SuperAdmin') {
      return res.status(403).send({ error: 'You are not authorised to perform this action' });
    }
    Users.findById(req.params.userId)
      .then((user) => {
        user.updateAttributes({
          role: 'Admin',
        });
        return res.status(202).send({ message: 'Admin User created successfully' });
      })
      .catch(error => res.status(500).send({ error: error.message }));
  }
}

export default User;
