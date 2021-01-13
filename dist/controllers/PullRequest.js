"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const changeDirectory_1 = require("../util/changeDirectory");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.default = {
    index(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield prisma.pullRequest.findMany({
                include: {
                    User: true,
                    Repository: true
                }
            });
            return res.status(200).json({
                error: false,
                status: 200,
                data: result
            });
        });
    },
    findDiffByHash(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.id) {
                const result = yield prisma.pullRequest.findFirst({
                    where: {
                        hash: req.params.id
                    },
                    include: {
                        Reviewers: {
                            include: {
                                User: true,
                            }
                        },
                    }
                });
                if (result) {
                    const cmdMerge = `${changeDirectory_1.CHANGE_DIRECTORY(req.params.repository)} && git checkout ${result.destination} && git merge ${result.origin}`;
                    child_process_1.exec(cmdMerge, (errorMerge, resultMerge, stderrMerge) => {
                        let cmd = `${changeDirectory_1.CHANGE_DIRECTORY(req.params.repository)} && git diff`;
                        if (resultMerge.indexOf('CONFLICT') === -1 && resultMerge.indexOf('Already up to date.')) {
                            child_process_1.exec(`${changeDirectory_1.CHANGE_DIRECTORY(req.params.repository)} && git reset --hard HEAD~1`, () => {
                                cmd = `${cmd} ${result.origin} ${result.destination}`;
                                child_process_1.exec(cmd, (errorDiff, resultDiff, stderrDiff) => {
                                    if (!errorDiff) {
                                        resetMergeAndReturnDiff(resultDiff, result, req, res);
                                    }
                                    else {
                                        console.log({ data: 'Diff: ' + stderrDiff });
                                        return res.json({
                                            status: 500,
                                            error: true,
                                            data: stderrDiff
                                        });
                                    }
                                });
                            });
                        }
                        else {
                            child_process_1.exec(cmd, (errorDiff, resultDiff, stderrDiff) => {
                                if (!errorDiff) {
                                    resetMergeAndReturnDiff(resultDiff, result, req, res, true);
                                }
                                else {
                                    console.log({ data: 'Diff: ' + stderrDiff });
                                    return res.json({
                                        status: 500,
                                        error: true,
                                        data: stderrDiff
                                    });
                                }
                            });
                        }
                    });
                }
                else {
                    return res.json({
                        status: 500,
                        error: true,
                        data: "Pullrequest não encontrado"
                    });
                }
            }
            else {
                return res.status(403).json({
                    error: true,
                    status: 403,
                    data: 'Requisição inválida!'
                });
            }
        });
    },
    indexByRepository(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield prisma.pullRequest.findMany({
                where: {
                    hash: req.body.hash
                },
                include: {
                    User: true,
                    Repository: true
                }
            });
            return res.status(200).json({
                error: false,
                status: 200,
                data: result
            });
        });
    },
    diff(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { origin, destination, repository } = req.body;
            const cmd = `${changeDirectory_1.CHANGE_DIRECTORY(repository)} && git diff ${destination} ${origin}`;
            child_process_1.exec(cmd, (error, stdout, stderr) => {
                return res.json({
                    error: false,
                    status: 200,
                    data: stdout !== ''
                });
            });
        });
    },
    store(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { origin, destination, title, description, reviewers, id, idRepository } = req.body;
            const result = yield prisma.pullRequest.create({
                data: {
                    origin: origin.replace('*', ''),
                    destination: destination.replace('*', ''),
                    description,
                    title,
                    hash: id,
                    status: 0,
                    index: 0,
                    Repository: {
                        connect: {
                            id: parseInt(idRepository)
                        }
                    },
                    User: {
                        connect: {
                            id: 1
                        }
                    },
                    Reviewers: {
                        create: reviewers
                    },
                }
            });
            if (result) {
                return res.status(201).json({
                    error: false,
                    status: 201,
                    data: result
                });
            }
            else {
                return res.status(500).json({
                    error: true,
                    status: 500,
                    data: "Ocorreu um erro ao salvar pull request"
                });
            }
        });
    },
    merge(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { origin, destination } = req.body;
            const cmd = `${changeDirectory_1.CHANGE_DIRECTORY(req.params.repository)} && git checkout ${destination} && git merge ${origin}  -m "Merge realizado com sucesso"`;
            child_process_1.exec(cmd, (error, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
                if (!error) {
                    yield prisma.pullRequest.update({
                        where: {
                            id: parseInt(req.body.id)
                        },
                        data: {
                            status: req.body.status
                        }
                    });
                    return res.json({ data: "Merge success" });
                }
                else {
                    return res.json({
                        error: true,
                        status: 500,
                        data: stderr
                    });
                }
            }));
        });
    }
};
function resetMergeAndReturnDiff(diff, result, req, res, abort = false) {
    let cmdAbort = `${changeDirectory_1.CHANGE_DIRECTORY(req.params.repository)}`;
    if (abort) {
        cmdAbort = `${changeDirectory_1.CHANGE_DIRECTORY(req.params.repository)} && git merge --abort`;
    }
    child_process_1.exec(cmdAbort, (errorAbort, resultAbort, stderrAbort) => __awaiter(this, void 0, void 0, function* () {
        if (!errorAbort) {
            return res.status(200).json({
                status: 200,
                error: false,
                data: { diff: diff.toString().trim().split('diff --git'), reviewers: result.Reviewers }
            });
        }
        else {
            console.log({ data: 'Abort: ' + stderrAbort });
            return res.json({
                status: 500,
                error: true,
                data: stderrAbort
            });
        }
    }));
}
//# sourceMappingURL=PullRequest.js.map