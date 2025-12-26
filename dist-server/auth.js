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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var db_js_1 = require("./db.js");
var config_js_1 = require("./config.js");
var schemas_js_1 = require("./schemas.js");
var router = express_1.default.Router();
// SIGNUP
router.post('/signup', (0, schemas_js_1.validateBody)(schemas_js_1.SignupSchema), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, password, userCheck, hashedPassword, result, user, token, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, email = _a.email, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, (0, db_js_1.query)('SELECT id FROM users WHERE email = $1', [email])];
            case 2:
                userCheck = _b.sent();
                if (userCheck.rows.length > 0) {
                    return [2 /*return*/, res.status(400).json({ error: 'Email already exists' })];
                }
                return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
            case 3:
                hashedPassword = _b.sent();
                return [4 /*yield*/, (0, db_js_1.query)('INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at', [name, email, hashedPassword])];
            case 4:
                result = _b.sent();
                user = result.rows[0];
                token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, config_js_1.config.jwtSecret, { expiresIn: '7d' });
                res.status(201).json({ user: user, token: token });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                console.error('Signup error:', error_1);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// LOGIN
router.post('/login', (0, schemas_js_1.validateBody)(schemas_js_1.LoginSchema), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, result, user, validPassword, token, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, db_js_1.query)('SELECT * FROM users WHERE email = $1', [email])];
            case 2:
                result = _b.sent();
                user = result.rows[0];
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid credentials' })];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password_hash)];
            case 3:
                validPassword = _b.sent();
                if (!validPassword) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid credentials' })];
                }
                token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, config_js_1.config.jwtSecret, { expiresIn: '7d' });
                // Remove password from response
                delete user.password_hash;
                res.json({ user: user, token: token });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                console.error('Login error:', error_2);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// GET ME (Validate Token)
router.get('/me', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, decoded, result, user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                authHeader = req.headers.authorization;
                if (!authHeader)
                    return [2 /*return*/, res.status(401).json({ error: 'No token' })];
                token = authHeader.split(' ')[1];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                decoded = jsonwebtoken_1.default.verify(token, config_js_1.config.jwtSecret);
                return [4 /*yield*/, (0, db_js_1.query)('SELECT id, name, email, ads_opt_in, points, streak, is_admin FROM users WHERE id = $1', [decoded.id])];
            case 2:
                result = _a.sent();
                user = result.rows[0];
                if (!user)
                    return [2 /*return*/, res.status(404).json({ error: 'User not found' })];
                res.json({ user: user });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                res.status(401).json({ error: 'Invalid token' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
