import eventController from '../controllers/events';
import auth from '../middlewares/auth';


export default(app) => {
  app.post('/api/v1/events/', auth, eventController.addEvent);
  app.put('/api/v1/events/:eventId', auth, eventController.modifyEvent);
  app.delete('/api/v1/events/:eventId', auth, eventController.deleteEvent);
  app.get('/api/v1/events/user', auth, eventController.getUserEvents);
  app.post('/api/v1/events/:eventId', auth, eventController.cancelUserEvent);
};
