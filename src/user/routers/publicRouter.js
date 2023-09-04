import express from 'express';
import FieldValidator from '../validators/field';
import SpecializationValidator from '../validators/specialization';
import SpecialistValidator from '../validators/specialist';
import FieldController from '../controllers/field';
import SpecializationController from '../controllers/specialization';
import SpecialistController from '../controllers/specialist';
import { catchAsync } from '../../../utils';
const router = express.Router();

router.get('/field', catchAsync(FieldValidator.getField), catchAsync(FieldController.getField));
router.get(
	'/specialization',
	catchAsync(SpecializationValidator.getSpecialization),
	catchAsync(SpecializationController.getSpecialization)
);
router.get(
	'/specialist',
	catchAsync(SpecialistValidator.getSpecialistList),
	catchAsync(SpecialistController.getSpecialistList)
);

export default router;
