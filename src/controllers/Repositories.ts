import { NextFunction, Request, Response } from "express";
import { exec } from 'child_process';
import enviroments from '../config/enviroments';

import { PrismaClient } from '@prisma/client';
import { PERMISSIONS } from "../util/changeDirectory";

const prisma = new PrismaClient();

export default {
    async index(req: Request, res: Response, next: NextFunction) {
        const result = await prisma.repository.findMany();
        return res.status(200).json({
            error: false,
            status: 200,
            data: result
        })
    },

    async createRepository(req: Request, res: Response, next: NextFunction) {
        if (req.body.name) {
            const cmd = `${PERMISSIONS} mkdir /srv/git/${req.body.name}`;
            exec(cmd, (error, stdout, stderr) => {
                if (!error) {
                    prisma.repository.create({
                        data: {
                            name: req.body.name
                        }
                    })
                } else {
                    return res.status(500).json({
                        error: false,
                        status: 200,
                        data: "Falha ao criar repositório"
                    })
                }
            });
        } else {
            return res.status(403).json({
                error: false,
                status: 200,
                data: "Nome do repositório inválido"
            })
        }
    }

}