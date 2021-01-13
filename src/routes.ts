import express from 'express';

import repositoriesController from './controllers/Repositories';
import branchController from './controllers/Branch';
import commitsController from './controllers/Commits';
import pullRequestController from './controllers/PullRequest';
import usersController from './controllers/Users';


const router = express.Router();

//Repositories
router.get('/', [repositoriesController.index]);
router.post("/createRepository", [repositoriesController.createRepository])

//Take Branchs
router.get('/:repository', [branchController.index]);
//Take Commits
router.get('/:repository/:branch/commits', [commitsController.index]);
//Pull requests
router.post('/pullrequest/:repository/:id', [pullRequestController.store]);
router.post('/:repository/merge', [pullRequestController.merge]);
router.post('/diff', pullRequestController.diff);
router.get('/pullrequests/index', [pullRequestController.index]);
router.get('/:repository/pullrequests', [pullRequestController.indexByRepository]);
router.get('/diff/:repository/:id', [pullRequestController.findDiffByHash]);

//search reviewers
router.get('/users/:name', [usersController.search]);

export default router;