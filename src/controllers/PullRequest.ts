import { NextFunction, Request, Response } from "express";
import ResponseModel from '../model/ResponseModel'

import { exec } from 'child_process';
import { CHANGE_DIRECTORY } from "../util/changeDirectory";

import { PrismaClient } from '@prisma/client';
import ModelResponse from "../model/ResponseModel";

const prisma = new PrismaClient();

export default {
    async index(req: Request, res: Response<ModelResponse>, next: NextFunction) {
        const result = await prisma.pullRequest.findMany({
            include: {
                User: true,
                Repository: true
            }
        });
        return res.status(200).json({
            error: false,
            status: 200,
            data: result
        })


    },
    async findDiffByHash(req: Request, res: Response<ResponseModel>, next: NextFunction) {
        if (req.params.id) {
            const result = await prisma.pullRequest.findFirst({
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
            })
            if (result) {
                const cmdMerge = `${CHANGE_DIRECTORY(req.params.repository)} && git checkout ${result.destination} && git merge ${result.origin}`;

                exec(cmdMerge, (errorMerge, resultMerge, stderrMerge) => {
                    let cmd = `${CHANGE_DIRECTORY(req.params.repository)} && git diff`
                    if (resultMerge.indexOf('CONFLICT') === -1 && resultMerge.indexOf('Already up to date.')) {
                        exec(`${CHANGE_DIRECTORY(req.params.repository)} && git reset --hard HEAD~1`, () => {
                            cmd = `${cmd} ${result.origin} ${result.destination}`;
                            exec(cmd, (errorDiff, resultDiff, stderrDiff) => {
                                if (!errorDiff) {
                                    resetMergeAndReturnDiff(resultDiff, result, req, res)
                                } else {
                                    console.log({ data: 'Diff: ' + stderrDiff })
                                    return res.json({
                                        status: 500,
                                        error: true,
                                        data: stderrDiff
                                    })
                                }
                            })
                        })
                    } else {

                        exec(cmd, (errorDiff, resultDiff, stderrDiff) => {
                            if (!errorDiff) {
                                resetMergeAndReturnDiff(resultDiff, result, req, res, true)
                            } else {
                                console.log({ data: 'Diff: ' + stderrDiff })
                                return res.json({
                                    status: 500,
                                    error: true,
                                    data: stderrDiff
                                })
                            }
                        })
                    }
                });
            } else {
                return res.json({
                    status: 500,
                    error: true,
                    data: "Pullrequest não encontrado"
                })
            }

        } else {
            return res.status(403).json({
                error: true,
                status: 403,
                data: 'Requisição inválida!'
            })
        }
    },
    async indexByRepository(req: Request, res: Response<ResponseModel>, next: NextFunction) {
        const result = await prisma.pullRequest.findMany({
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
        })


    },

    async diff(req: Request, res: Response<ResponseModel>, next: NextFunction) {
        const { origin, destination, repository } = req.body;

        const cmd = `${CHANGE_DIRECTORY(repository)} && git diff ${destination} ${origin}`;
        exec(cmd, (error, stdout, stderr) => {
            return res.json({
                error: false,
                status: 200,
                data: stdout !== ''
            })
        });

    },
    async store(req: Request, res: Response<ResponseModel>, next: NextFunction) {
        const { origin, destination, title, description, reviewers, id, idRepository } = req.body;
        const result = await prisma.pullRequest.create({
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
        })



        if (result) {
            return res.status(201).json({
                error: false,
                status: 201,
                data: result
            })
        } else {
            return res.status(500).json({
                error: true,
                status: 500,
                data: "Ocorreu um erro ao salvar pull request"
            })
        }
    },

    async merge(req: Request, res: Response, next: NextFunction) {
        const { origin, destination } = req.body;
        const cmd = `${CHANGE_DIRECTORY(req.params.repository)} && git checkout ${destination} && git merge ${origin}  -m "Merge realizado com sucesso"`;
        exec(cmd, async (error, stdout, stderr) => {
            if (!error) {
                await prisma.pullRequest.update({
                    where: {
                        id: parseInt(req.body.id)
                    },
                    data: {
                        status: req.body.status
                    }
                })
                return res.json({ data: "Merge success" })
            } else {
                return res.json({
                    error: true,
                    status: 500,
                    data: stderr
                })
            }



        })
    }
}

function resetMergeAndReturnDiff(diff: string, result: any, req: Request, res: Response<ResponseModel>, abort = false) {
    let cmdAbort = `${CHANGE_DIRECTORY(req.params.repository)}`;
    if (abort) {
        cmdAbort = `${CHANGE_DIRECTORY(req.params.repository)} && git merge --abort`;
    }
    exec(cmdAbort, async (errorAbort, resultAbort, stderrAbort) => {
        if (!errorAbort) {
            return res.status(200).json({
                status: 200,
                error: false,
                data: { diff: diff.toString().trim().split('diff --git'), reviewers: result.Reviewers }
            })
        } else {
            console.log({ data: 'Abort: ' + stderrAbort })
            return res.json({
                status: 500,
                error: true,
                data: stderrAbort
            })
        }
    })
}