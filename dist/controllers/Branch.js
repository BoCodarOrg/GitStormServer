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
exports.default = {
    index(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            child_process_1.exec(`${changeDirectory_1.CHANGE_DIRECTORY(req.params.repository)} && git branch`, (error, stdout, stderr) => {
                return res.json({ data: stdout.toString().trim().split('\n').map(item => ({ name: item.replace('*', '').trim() })), repo: req.params.repository });
            });
        });
    }
};
//# sourceMappingURL=Branch.js.map