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
const client_1 = require("@prisma/client");
const changeDirectory_1 = require("../util/changeDirectory");
const prisma = new client_1.PrismaClient();
exports.default = {
    index(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield prisma.repository.findMany();
            return res.status(200).json({
                error: false,
                status: 200,
                data: result
            });
        });
    },
    createRepository(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.name) {
                const cmd = `${changeDirectory_1.PERMISSIONS} mkdir /srv/git/${req.body.name}`;
                child_process_1.exec(cmd, (error, stdout, stderr) => {
                    if (!error) {
                        prisma.repository.create({
                            data: {
                                name: req.body.name,
                                description: req.body.description || '',
                                language: req.body.language || 'Não especificada'
                            }
                        });
                        return res.status(200).json({
                            error: false,
                            status: 200,
                            data: stdout
                        });
                    }
                    else {
                        return res.status(500).json({
                            error: false,
                            status: 200,
                            data: "Falha ao criar repositório"
                        });
                    }
                });
            }
            else {
                return res.status(403).json({
                    error: false,
                    status: 200,
                    data: "Nome do repositório inválido"
                });
            }
        });
    }
};
//# sourceMappingURL=Repositories.js.map