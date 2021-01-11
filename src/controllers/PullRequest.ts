import { NextFunction, Request, Response } from "express";
import ResponseModel from '../model/ResponseModel'

import { exec } from 'child_process';
import { CHANGE_DIRECTORY } from "../util/changeDirectory";

import { PrismaClient } from '@prisma/client';
import ModelResponse from "../model/ResponseModel";

const prisma = new PrismaClient();

export default {
    async index(req: Request, res: Response<ModelResponse>, next: NextFunction) {
        const result = await prisma.pullRequest.findMany();
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
                }
            })
            if (result) {
                const cmdMerge = `${CHANGE_DIRECTORY(req.params.repository)} && git checkout ${result.destination.trim().replace('*', '')} && git merge ${result.origin.trim().replace('*', '')}`;
                exec(cmdMerge, (errorMerge, resultMerge, stderrMerge) => {
                    const cmd = `${CHANGE_DIRECTORY(req.params.repository)} && git diff`
                    exec(cmd, (errorDiff, resultDiff, stderrDiff) => {
                        if (!errorDiff) {
                            const cmdAbort = `${CHANGE_DIRECTORY(req.params.repository)} && git merge --abort`;
                            exec(cmdAbort, async (errorAbort, resultAbort, stderrAbort) => {
                                if (!errorAbort) {
                                    return res.status(200).json({
                                        status: 200,
                                        error: false,
                                        data: resultDiff.toString().trim().split('diff --git')
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
                        } else {
                            console.log({ data: 'Diff: ' + stderrDiff })
                            return res.json({
                                status: 500,
                                error: true,
                                data: stderrDiff
                            })
                        }
                    })
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
    async store(req: Request, res: Response<ResponseModel>, next: NextFunction) {
        const { origin, destination, title, description, reviewers, id, idRepository } = req.body;
        const result = await prisma.pullRequest.create({
            data: {
                origin,
                destination,
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
                Reviewers: {
                    create: reviewers
                }
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
        const cmd = `${CHANGE_DIRECTORY(req.params.repository)} && git checkout ${destination} && git merge ${origin}`;
        exec(cmd, (error, stdout, stderr) => {
            if (!error) {
                return res.json({ data: "Merge success" })
            } else {

                return res.json({ data: stderr })
            }
        })
    }
}