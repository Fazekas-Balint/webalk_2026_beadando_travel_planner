import { Router } from 'express';
import { get, update } from './days.controller';
import { validate } from '../../middleware/validate';
import { updateDaySchema } from './days.schema';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/:id', get);
router.patch('/:id', validate(updateDaySchema), update);

export default router;