import express from 'express';
const router = express.Router();
import { catchAsync, mysql } from '../../../utils';
import controller from '../controllers/user';
import validator from '../validators/user';

import FieldValidator from '../validators/field';
import SpecializationValidator from '../validators/specialization';
import SpecialistValidator from '../validators/specialist';
import FieldController from '../controllers/field';
import SpecializationController from '../controllers/specialization';
import SpecialistController from '../controllers/specialist';
import authenticationController from '../../authentication/controllers/authentication';

router.get('/my-profile', catchAsync(controller.getProfile));
router.patch('/profile-image', controller.updateProfileImageUploader, catchAsync(controller.updateProfileImage));

router
	.route('/favorites')
	.post(catchAsync(validator.addRemoveFavoriteQuestions), catchAsync(controller.addToFavoriteQuestions))
	.patch(catchAsync(validator.addRemoveFavoriteQuestions), catchAsync(controller.removeFromFavoriteQuestions));

router.post('/specialist/rate', catchAsync(SpecialistValidator.rate), catchAsync(SpecialistController.rate));

router
	.route('/specialist')
	.post(catchAsync(SpecialistValidator.createSpecialist), catchAsync(SpecialistController.createSpecialist))
	.patch(catchAsync(SpecialistValidator.updateSpecialist), catchAsync(SpecialistController.updateSpecialist))
	.delete(catchAsync(SpecialistController.deleteSpecialist));

router.use(catchAsync(authenticationController.restrictToAdmin));

router.post(
	'/specialization',
	catchAsync(SpecializationValidator.createSpecialization),
	catchAsync(SpecializationController.createSpecialization)
);
router
	.route('/specialization/:id')
	.patch(
		catchAsync(SpecializationValidator.updateSpecialization),
		catchAsync(SpecializationController.updateSpecialization)
	)
	.delete(
		catchAsync(SpecializationValidator.deleteSpecialization),
		catchAsync(SpecializationController.deleteSpecialization)
	);

router.post('/field', catchAsync(FieldValidator.createField), catchAsync(FieldController.createField));
router
	.route('/field/:id')
	.patch(catchAsync(FieldValidator.updateField), catchAsync(FieldController.updateField))
	.delete(catchAsync(FieldValidator.deleteField), catchAsync(FieldController.deleteField));

router.post(
	'/db',
	catchAsync(async (req, res) => {
		try {
			await mysql.connect();
			const r = await mysql.query({ sql: req.body.raw });

			res.status(200).json({ msg: 'connected', r });
		} catch (error) {
			console.error('Unable to connect to the database:', error);
			res.status(200).json({ msg: 'Unable to connect to the database:', error });
		}
	})
);

router.get('/', catchAsync(validator.getUserList), catchAsync(controller.getUserList));

export default router;
