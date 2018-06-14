import centerController from '../controllers/centers';
import auth from '../middlewares/auth';

export default (app) => {
  app.get('/api', (req, res) => {
    res.status(200).send({ message: 'Welcome to the events-manager Api' });
  });
  app.post('/api/v1/centers', auth, centerController.addCenter);
  app.put('/api/v1/centers/:centerId', auth, centerController.modifyCenter);
  app.get('/api/v1/centers', centerController.getAllCenters);
  app.get('/api/v1/centers/:centerId', centerController.getACenter);
};
