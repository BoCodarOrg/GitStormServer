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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeDirectoryCmd = exports.chageDirectoryReq = exports.PERMISSIONS = exports.CHANGE_DIRECTORY = void 0;
const child_process_1 = require("child_process");
const enviroments_1 = __importDefault(require("../config/enviroments"));
const CHANGE_DIRECTORY = (repo) => (`echo ${enviroments_1.default.passGit} | sudo -u ${enviroments_1.default.userGit} -S cd ${enviroments_1.default.dirFiles}/${repo}`);
exports.CHANGE_DIRECTORY = CHANGE_DIRECTORY;
exports.PERMISSIONS = `echo ${enviroments_1.default.passGit} | sudo -u ${enviroments_1.default.userGit} -S `;
const chageDirectoryReq = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    child_process_1.exec(`cd ${enviroments_1.default.dirFiles}/${req.params.repository}`, (error, stdout, stderr) => {
        return new Promise((resolve, reject) => {
            if (!error) {
                resolve(stdout);
                return next();
            }
            else {
                reject(error);
                return next(false);
            }
        });
    });
});
exports.chageDirectoryReq = chageDirectoryReq;
const changeDirectoryCmd = (repo) => __awaiter(void 0, void 0, void 0, function* () {
    child_process_1.exec(`cd ${enviroments_1.default.dirFiles}/${repo}`, (error, stdout, stderr) => {
        return new Promise((resolve, reject) => {
            if (!error) {
                resolve(stdout);
            }
            else {
                reject(error);
            }
        });
    });
});
exports.changeDirectoryCmd = changeDirectoryCmd;
//# sourceMappingURL=changeDirectory.js.map