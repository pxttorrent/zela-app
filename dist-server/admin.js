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
var express_1 = require("express");
var db_js_1 = require("./db.js");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_js_1 = require("./config.js");
var router = (0, express_1.Router)();
// Middleware: Verify Token & Check Admin
var adminAuth = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, decoded, rows, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                authHeader = req.headers.authorization;
                if (!authHeader)
                    return [2 /*return*/, res.status(401).json({ error: 'No token provided' })];
                token = authHeader.split(' ')[1];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                decoded = jsonwebtoken_1.default.verify(token, config_js_1.config.jwtSecret);
                req.user = decoded;
                return [4 /*yield*/, (0, db_js_1.query)('SELECT email, is_admin FROM users WHERE id = $1', [decoded.id])];
            case 2:
                rows = (_a.sent()).rows;
                if (rows.length > 0 && rows[0].is_admin === true) {
                    next();
                }
                else {
                    res.status(403).json({ error: 'Forbidden: Admin access only' });
                }
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                res.status(401).json({ error: 'Invalid or expired token' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
router.use(adminAuth);
// --- USERS ---
router.get('/users', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var rows, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_js_1.query)("\n      SELECT id, name, email, points, streak, created_at, ads_opt_in \n      FROM users \n      ORDER BY created_at DESC \n      LIMIT 100\n    ")];
            case 1:
                rows = (_a.sent()).rows;
                res.json(rows);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                res.status(500).json({ error: 'Failed to fetch users' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// --- VACCINES ---
router.get('/vaccines', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var rows, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_js_1.query)('SELECT * FROM vaccine_templates ORDER BY days_from_birth ASC')];
            case 1:
                rows = (_a.sent()).rows;
                res.json(rows);
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                res.status(500).json({ error: 'Failed to fetch vaccines' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/vaccines', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, daysFromBirth, description, rows, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, daysFromBirth = _a.daysFromBirth, description = _a.description;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, db_js_1.query)('INSERT INTO vaccine_templates (name, days_from_birth, description) VALUES ($1, $2, $3) RETURNING *', [name, daysFromBirth, description])];
            case 2:
                rows = (_b.sent()).rows;
                res.json(rows[0]);
                return [3 /*break*/, 4];
            case 3:
                err_4 = _b.sent();
                res.status(500).json({ error: 'Failed to create vaccine' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.delete('/vaccines/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_js_1.query)('DELETE FROM vaccine_templates WHERE id = $1', [req.params.id])];
            case 1:
                _a.sent();
                res.json({ success: true });
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                res.status(500).json({ error: 'Failed to delete vaccine' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// --- MISSIONS (CHALLENGES) ---
router.get('/missions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var rows, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_js_1.query)('SELECT * FROM challenge_templates ORDER BY id DESC')];
            case 1:
                rows = (_a.sent()).rows;
                res.json(rows);
                return [3 /*break*/, 3];
            case 2:
                err_6 = _a.sent();
                res.status(500).json({ error: 'Failed to fetch missions' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/missions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, description, category, minAgeWeeks, maxAgeWeeks, xpReward, rows, err_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, title = _a.title, description = _a.description, category = _a.category, minAgeWeeks = _a.minAgeWeeks, maxAgeWeeks = _a.maxAgeWeeks, xpReward = _a.xpReward;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, db_js_1.query)('INSERT INTO challenge_templates (title, description, category, min_age_weeks, max_age_weeks, xp_base) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [title, description, category, minAgeWeeks, maxAgeWeeks || 100, xpReward || 10])];
            case 2:
                rows = (_b.sent()).rows;
                res.json(rows[0]);
                return [3 /*break*/, 4];
            case 3:
                err_7 = _b.sent();
                res.status(500).json({ error: 'Failed to create mission' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.delete('/missions/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_js_1.query)('DELETE FROM challenge_templates WHERE id = $1', [req.params.id])];
            case 1:
                _a.sent();
                res.json({ success: true });
                return [3 /*break*/, 3];
            case 2:
                err_8 = _a.sent();
                res.status(500).json({ error: 'Failed to delete mission' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// --- ADS ---
router.get('/ads', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var rows, err_9;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_js_1.query)('SELECT ad_config FROM app_settings WHERE id = 1')];
            case 1:
                rows = (_b.sent()).rows;
                res.json(((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.ad_config) || { enabled: true, clientId: '', slots: { dashboard: '' } });
                return [3 /*break*/, 3];
            case 2:
                err_9 = _b.sent();
                res.status(500).json({ error: 'Failed to fetch ad config' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/ads', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var config, rows, err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                config = req.body;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, db_js_1.query)('UPDATE app_settings SET ad_config = $1, updated_at = now() WHERE id = 1 RETURNING ad_config', [JSON.stringify(config)])];
            case 2:
                rows = (_a.sent()).rows;
                res.json(rows[0].ad_config);
                return [3 /*break*/, 4];
            case 3:
                err_10 = _a.sent();
                res.status(500).json({ error: 'Failed to update ad config' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// --- PUSH NOTIFICATIONS ---
router.get('/push', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var rows, err_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_js_1.query)('SELECT * FROM push_history ORDER BY sent_at DESC LIMIT 50')];
            case 1:
                rows = (_a.sent()).rows;
                res.json(rows);
                return [3 /*break*/, 3];
            case 2:
                err_11 = _a.sent();
                res.status(500).json({ error: 'Failed to fetch push history' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/push', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, body, audience, rows, err_12;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, title = _a.title, body = _a.body, audience = _a.audience;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, db_js_1.query)('INSERT INTO push_history (title, body, audience, created_by) VALUES ($1, $2, $3, $4) RETURNING *', [title, body, audience, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id])];
            case 2:
                rows = (_c.sent()).rows;
                res.json(rows[0]);
                return [3 /*break*/, 4];
            case 3:
                err_12 = _c.sent();
                res.status(500).json({ error: 'Failed to send push' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
