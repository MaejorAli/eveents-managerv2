import userController from '../controllers/users';

export default (app) => {
  app.post('/api/v1/users/signup', userController.signup);
  app.post('/api/v1/users/signin', userController.signin);
};
