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
const child_process_1 = require("child_process");
const parseToObject_1 = __importDefault(require("../util/parseToObject"));
const changeDirectory_1 = require("../util/changeDirectory");
exports.default = {
    index(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const cmd = `${changeDirectory_1.CHANGE_DIRECTORY(req.params.repository)} && git log ${req.params.branch} --pretty=format:'{"commit":"%h","date":"%ad","message":"%s","author":"%an", "email":"%ce"}' --date=short`;
            child_process_1.exec(cmd, (error, stdout, stderr) => {
                if (!error) {
                    const result = parseToObject_1.default(`${stdout}`);
                    return res.json({ data: result, branch: req.params.branch });
                }
                else {
                    console.log('error::', error);
                    return res.send(`error::${error}`);
                }
            });
        });
    }
};
//# sourceMappingURL=Commits.js.map