"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Repositories_1 = __importDefault(require("./controllers/Repositories"));
const Branch_1 = __importDefault(require("./controllers/Branch"));
const Commits_1 = __importDefault(require("./controllers/Commits"));
const PullRequest_1 = __importDefault(require("./controllers/PullRequest"));
const Users_1 = __importDefault(require("./controllers/Users"));
const router = express_1.default.Router();
//Take Repositories
router.get('/', [Repositories_1.default.index]);
//Take Branchs
router.get('/:repository', [Branch_1.default.index]);
//Take Commits
router.get('/:repository/:branch/commits', [Commits_1.default.index]);
//Pull requests
router.get('/diff/:repository/:id', [PullRequest_1.default.findDiffByHash]);
router.post('/pullrequest/:repository/:id', [PullRequest_1.default.store]);
//pull requests
router.post('/:repository/merge', [PullRequest_1.default.merge]);
//list Pull requests
router.get('/pullrequests/index', [PullRequest_1.default.index]);
// router.get('/:repository/pullrequests', [pullRequestController.indexByRepository]);
//search reviewers
router.get('/users/:name', [Users_1.default.search]);
exports.default = router;
//# sourceMappingURL=routes.js.map