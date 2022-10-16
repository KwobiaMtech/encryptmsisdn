"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AppService = void 0;
var common_1 = require("@nestjs/common");
var crypto_1 = require("crypto");
var util_1 = require("util");
var encrypt_entity_1 = require("./entities/encrypt.entity");
var AppService = /** @class */ (function () {
    function AppService(em) {
        this.em = em;
    }
    AppService.prototype.getHello = function () {
        return 'Hello World!';
    };
    AppService.prototype.encrypt = function (msisdn) {
        return __awaiter(this, void 0, void 0, function () {
            var iv, password, key, cipher, encrypted, encryptedText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iv = (0, crypto_1.randomBytes)(16);
                        password = (0, crypto_1.randomUUID)();
                        return [4 /*yield*/, (0, util_1.promisify)(crypto_1.scrypt)(password, 'salt', 32)];
                    case 1:
                        key = (_a.sent());
                        cipher = (0, crypto_1.createCipheriv)('aes-256-ctr', key, iv);
                        encrypted = Buffer.concat([cipher.update(msisdn), cipher.final()]);
                        encryptedText = encrypted.toString('hex');
                        // const toDecrypt = Buffer.from(humanText, 'hex');
                        // await this.decrypt(key, toDecrypt, iv);
                        return [4 /*yield*/, this.saveEncryption({
                                iv: iv,
                                encryptedText: encryptedText,
                                key: key,
                                msisdn: msisdn
                            })];
                    case 2:
                        // const toDecrypt = Buffer.from(humanText, 'hex');
                        // await this.decrypt(key, toDecrypt, iv);
                        _a.sent();
                        return [2 /*return*/, encryptedText];
                }
            });
        });
    };
    AppService.prototype.decrypt = function (key, encryptedText, iv) {
        return __awaiter(this, void 0, void 0, function () {
            var decipher, decryptedText;
            return __generator(this, function (_a) {
                decipher = (0, crypto_1.createDecipheriv)('aes-256-ctr', key, iv);
                decryptedText = Buffer.concat([
                    decipher.update(encryptedText),
                    decipher.final(),
                ]);
                console.log('decrypted', decryptedText.toString());
                return [2 /*return*/];
            });
        });
    };
    AppService.prototype.saveEncryption = function (encryptedData) {
        return __awaiter(this, void 0, void 0, function () {
            var encrypt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        encrypt = new encrypt_entity_1.EncryptEntity();
                        encrypt.msisdn = encryptedData.msisdn;
                        encrypt.key = this.bufferToString(encryptedData.key);
                        encrypt.iv = this.bufferToString(encryptedData.iv);
                        encrypt.encryptedText = encryptedData.encryptedText;
                        return [4 /*yield*/, this.em.save(encrypt)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.bufferToString = function (buffer) {
        return buffer.toString('hex');
    };
    AppService = __decorate([
        (0, common_1.Injectable)()
    ], AppService);
    return AppService;
}());
exports.AppService = AppService;
