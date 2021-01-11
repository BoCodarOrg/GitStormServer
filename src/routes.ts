import express from 'express';

import repositoriesController from './controllers/Repositories';
import branchController from './controllers/Branch';
import commitsController from './controllers/Commits';
import pullRequestController from './controllers/PullRequest';
import usersController from './controllers/Users';


const router = express.Router();

//Take Repositories
router.get('/', [repositoriesController.index]);
//Take Branchs
router.get('/:repository', [branchController.index]);
//Take Commits
router.get('/:repository/:branch/commits', [commitsController.index]);
//Pull requests
router.get('/diff/:repository/:id', [pullRequestController.findDiffByHash]);
router.post('/pullrequest/:repository/:id', [pullRequestController.store]);
//pull requests
router.post('/:repository/merge', [pullRequestController.merge]);
//list Pull requests
router.get('/pullrequests/index', [pullRequestController.index]);
// router.get('/:repository/pullrequests', [pullRequestController.indexByRepository]);
//search reviewers
router.get('/users/:name', [usersController.search]);

export default router;