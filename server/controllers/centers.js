import models from '../models';

const { Centers, Events } = models;

/* class containing all methods that handle
center related API endpoints
*/

class Center {
  static addCenter(req, res) {
    const { role } = req.decoded;
    const {
      name,
      type,
      address,
      capacity,
      imageUrl,
      mobileNumber,
    } = req.body;
    if (role === 'User') {
      return res.status(403).send({ error: 'You are not authorized to perform this action' });
    }
    return Centers
      .create({
        name,
        type,
        address,
        capacity,
        imageUrl,
        mobileNumber,
        user: req.decoded.userId,
      })
      .then(center => res.status(200).send({ message: 'You have added a center successfully', center }))
      .catch(error => res.status(500).send({ error: error.message }));
  }


  static modifyCenter(req, res) {
    const { role } = req.decoded;
    if (role === 'User') {
      return res.status(400).send({ error: 'You are not authorized to perform this action' });
    }
    if (Object.keys(req.body).length < 1) {
      return Centers.findOne({
        where: {
          id: req.params.centerId,
        },
      })
        .then((center) => {
          if (center.isAvailable) {
            center.updateAttributes({
              isAvailable: false,
            });
            return res.status(200).send({ message: 'You successfully changed center status to false', center });
          }
          center.updateAttributes({
            isAvailable: true,
          });
          return res.status(200).send({ message: 'You successfully changed availability status to true', center });
        })
        .catch(error => res.status(500).send({ error: error.message }));
    }
    return Centers
      .findOne({
        where: {
          id: req.params.centerId,
        },
      })
      .then((center) => {
        if (!center) {
          return res.status(400).send({ error: 'Center not found!' });
        }
        if (center && center.user !== req.decoded.userId) {
          return res.status(400).send({ error: 'You cannot modify a center added by another user' });
        }
        center.updateAttributes({
          name: req.body.name || center.name,
          type: req.body.type || center.type,
          address: req.body.address || center.address,
          mobileNumber: req.body.mobileNumber || center.mobileNumber,
          imageUrl: req.body.imageUrl || center.imageUrl,
          capacity: parseFloat(req.body.capacity) || center.capacity,
        });
        return res.status(200).send({ message: 'You have modified the center successfully', center });
      })
      .catch(error => res.status(500).send({ error: error.message }));
  }

  /**
 * Get all Centers
 * @param {object} req The request body of the request.
 * @param {object} res The response body.
 * @returns {array} res.
 */
  static getAllCenters(req, res) {
    return Centers.findAll()
      .then((centers) => {
        if (centers.length < 1) {
          return res.status(400).send({ message: 'There are no centers' });
        }
        return res.status(200).send({ message: 'Successful', centers });
      })
      .catch(error => res.status(500).send({ error: error.message }));
  }
  /**
 * Get A Centers
 * @param {object} req The request body of the request.
 * @param {object} res The response body.
 * @returns {array} res.
 */
  static getACenter(req, res) {
    return Centers
      .findOne({
        where: {
          id: req.params.centerId,
        },
      })
      .then((center) => {
        if (!center) {
          return res.status(400).send({ error: 'No center found' });
        }
        Centers.findOne({
          where: {
            name: center.name,
          },
          include: [{
            model: Events,
            as: 'venueOfEvent',
          }],
        })
          .then(oneCenter => res.status(200).send({ message: 'Success', oneCenter }))
          .catch(error => res.status(500).send({ error: error.message }));
      })
      .catch(error => res.status(500).send({ error: error.message }));
  }
}


export default Center;
