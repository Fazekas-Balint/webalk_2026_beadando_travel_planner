import { Router } from 'express';
import { create, list, get, remove } from './trips.controller';
import { create as createActivity } from '../activities/activities.controller';
import { validate } from '../../middleware/validate';
import { createTripSchema } from './trips.schema';
import { createActivitySchema } from '../activities/activities.schema';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.use(requireAuth); 

router.post('/', validate(createTripSchema), create);
router.get('/', list);
router.get('/:id', get);
router.delete('/:id', remove);

router.post('/:id/activities', validate(createActivitySchema), createActivity);

export default router;