import { Router } from 'express';
import { update, remove } from './activities.controller';
import { validate } from '../../middleware/validate';
import { updateActivitySchema } from './activities.schema';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.use(requireAuth);

router.patch('/:id', validate(updateActivitySchema), update);
router.delete('/:id', remove);

export default router;