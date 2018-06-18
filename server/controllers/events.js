import models from '../models';
import mailSender from '../middlewares/mailer';


const { Events, Users } = models;

/* class containing all methods that handle
Events related API endpoints
*/

class Event {
  /**
 * Addan event
 * @param {object} req The request body of the request.
 * @param {object} res The response body.
 * @returns {object} res.
 */

  static addEvent(req, res) {
    const {
      name,
      type,
      date,
      center,
    } = req.body;
    Events
      .findOne({
        where: {
          date: new Date(date).toISOString(),
          center,
        },
      })
      .then((event) => {
        if (event) {
          return res.status(400).send({ error: 'Another event has been fixed at this date at this center,Please choose another date or center' });
        }
        return Events
          .create({
            name,
            type,
            center,
            date: new Date(date).toISOString(),
            user: req.decoded.userId,
          })
          .then(newEvent => res.status(201).send({ message: 'Event successfully added', newEvent }))
          .catch((error) => {
            if (error.message === 'insert or update on table \"Events\" violates foreign key constraint \"Events_center_fkey\"') {
              return res.status(400).send({ error: 'chosen center does not exist' });
            }
            return res.status(500).send({ error: error.message });
          });
      })
      .catch(error => res.status(500).send({ error: error.message }));
  }

  /**
 * modify an event
 * @param {object} req The request body of the request.
 * @param {object} res The response body.
 * @returns {object} res.
 */
  static modifyEvent(req, res) {
    const { center } = req.body;
    Events.findOne({
      where: {
        date: new Date(req.body.date).toISOString(),
        center,
      },
    })
      .then((event) => {
        if (event) {
          return res.status(400).send({ error: 'Another event has been fixed at this date at this center,Please choose another date or center' });
        }
        Events.findById(req.params.eventId)
          .then((modifiedEvent) => {
            if (!modifiedEvent) {
              return res.status(404).send({ error: 'No event found' });
            }
            modifiedEvent.updateAttributes({
              name: req.body.name || modifiedEvent.name,
              type: req.body.type || modifiedEvent.type,
              date: new Date(req.body.date).toISOString() || modifiedEvent.date,
              center: req.body.center || modifiedEvent.center,
            });
            return res.status(200).send({ message: 'successfully modified', modifiedEvent });
          })
          .catch(error => res.status(500).send({ error: error.message }));
      })
      .catch(error => res.status(500).send({ error: error.message }));
  }

  /**
 * delete an event
 * @param {object} req The request body of the request.
 * @param {object} res The response body.
 * @returns {object} res.
 */
  static deleteEvent(req, res) {
    Events.findById(req.params.eventId)
      .then((event) => {
        if (!event) {
          return res.status(404).send({ error: 'event not found' });
        }
        if (event && event.user !== req.decoded.userId) {
          return res.status(403).send({ error: 'You cannot delete an event added by another user' });
        }
        event.destroy()
          .then(() => res.status(200).send({ message: 'Event successfully deleted' }))
          .catch(error => res.status(500).send({ error: error.message }));
      })
      .catch(error => res.status(500).send({ error: error.message }));
  }

  /**
 * get User Events
 * @param {object} req The request body of the request.
 * @param {object} res The response body.
 * @returns {object} res.
 */
  static getUserEvents(req, res) {
    Events.findAll({
      where: {
        user: req.decoded.userId,
      },
    })
      .then((userEvents) => {
        if (!userEvents) {
          return res.status(404).send({ error: 'No events found for this User' });
        }
        return res.status(200).send({ message: 'Success', userEvents });
      })
      .catch(error => res.status(500).send({ error: error.message }));
  }

  /**
 * get User Events
 * @param {object} req The request body of the request.
 * @param {object} res The response body.
 * @returns {object} res.
 */
  static cancelUserEvent(req, res) {
    if (req.decoded.role === 'User') {
      return res.status(403).send({ error: 'You are not authorized to perform this action' });
    }
    Events.findById(req.params.eventId)
      .then((event) => {
        event.updateAttributes({
          center: null,
        });
        Users.findById(event.user)
          .then((user) => {
            const mailOptions = {
              from: 'alieventsmanager@gmail.com',
              to: user.email,
              subject: 'Notice Of cancellation of event',
              text: 'This Is to Inform You that For some reasons ,Your event has been canceled!',
            };
            mailSender(mailOptions);
            return res.status(200).send({ message: 'Event canceled and notification sent' });
          })
          .catch(error => res.status(500).send({ error: error.message }));
      })
      .catch(error => res.status(500).send({ error: error.message }));
  }
}


export default Event;
