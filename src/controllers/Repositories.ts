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
            const cmd = `${PERMISSIONS} mkdir /srv/git/${req.body.name}.git && cd ${req.body.name}.git && git init --bare `;
            exec(cmd, (error, stdout, stderr) => {
                if (!error) {
                    prisma.repository.create({
                        data: {
                            name: req.body.name,
                            description: req.body.description || '',
                            language: req.body.language || 'Não especificada'
                        }
                    })
                    return res.status(200).json({
                        error: false,
                        status: 200,
                        data: stdout
                    })
                } else {
                    console.log(error);
                    return res.status(500).json({
                        error: true,
                        status: 500,
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