import express from 'express';

import repositoriesController from './controllers/Repositories';
import branchController from './controllers/Branch';
import commitsController from './controllers/Commits';
import pullRequestController from './controllers/PullRequest';

import { changeDirectoryCmd } from './util/changeDirectory'

const router = express.Router();

//Take Repositories
router.get('/', [repositoriesController.index]);
//Take Branchs
router.get('/:repository', [branchController.index]);
//Take Commits
router.get('/:repository/:branch/commits', [commitsController.index]);
//Pull requests
router.post('/diff/:repository/:id', [pullRequestController.store]);
//pull requests
router.post('/:repository/merge', [pullRequestController.merge]);

export default router;