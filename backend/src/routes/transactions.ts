// Route definitions for /transactions (URL -> middleware -> controller).

import { Router } from 'express';
import { getTransactions, postTransaction } from '../controllers/transactions.js';
import { validate } from '../middleware/validate.js';
import { newTransactionSchema } from '../validators/transactions.js';

const router = Router();

router.get('/', getTransactions);
router.post('/', validate(newTransactionSchema), postTransaction);

export default router;
