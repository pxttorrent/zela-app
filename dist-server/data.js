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
var db_js_1 = require("./db.js");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_js_1 = require("./config.js");
var schemas_js_1 = require("./schemas.js");
var router = express_1.default.Router();
// Middleware to check auth
var authenticate = function (req, res, next) {
    var authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ error: 'No token' });
    var token = authHeader.split(' ')[1];
    try {
        var decoded = jsonwebtoken_1.default.verify(token, config_js_1.config.jwtSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
router.use(authenticate);
// --- DASHBOARD (LOAD EVERYTHING) ---
router.get('/dashboard', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, babyRes, baby, trackers, recentChallenges, trackersRes, challengesRes, configRes, adConfig, err_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                return [4 /*yield*/, (0, db_js_1.query)('SELECT * FROM babies WHERE user_id = $1 LIMIT 1', [userId])];
            case 1:
                babyRes = _c.sent();
                baby = babyRes.rows[0] || null;
                trackers = [];
                recentChallenges = [];
                if (!baby) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, db_js_1.query)('SELECT * FROM tracker_logs WHERE baby_id = $1 ORDER BY timestamp DESC LIMIT 50', [baby.id])];
            case 2:
                trackersRes = _c.sent();
                trackers = trackersRes.rows;
                _c.label = 3;
            case 3: return [4 /*yield*/, (0, db_js_1.query)('SELECT * FROM user_challenges WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20', [userId])];
            case 4:
                challengesRes = _c.sent();
                recentChallenges = challengesRes.rows;
                return [4 /*yield*/, (0, db_js_1.query)('SELECT ad_config FROM app_settings WHERE id = 1')];
            case 5:
                configRes = _c.sent();
                adConfig = ((_b = configRes.rows[0]) === null || _b === void 0 ? void 0 : _b.ad_config) || { enabled: false, clientId: '', slots: { dashboard: '' } };
                res.json({
                    baby: baby,
                    trackers: trackers,
                    recentChallenges: recentChallenges,
                    adConfig: adConfig
                });
                return [3 /*break*/, 7];
            case 6:
                err_1 = _c.sent();
                console.error(err_1);
                res.status(500).json({ error: 'Failed to load dashboard' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
// --- BABY ---
router.post('/baby', (0, schemas_js_1.validateBody)(schemas_js_1.BabySchema), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, birthDate, gender, userId, check, result, result, err_2;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, name = _a.name, birthDate = _a.birthDate, gender = _a.gender;
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 7, , 8]);
                return [4 /*yield*/, (0, db_js_1.query)('SELECT id FROM babies WHERE user_id = $1', [userId])];
            case 2:
                check = _c.sent();
                if (!(check.rows.length > 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, db_js_1.query)('UPDATE babies SET name = $1, birth_date = $2, gender = $3 WHERE user_id = $4 RETURNING *', [name, birthDate, gender, userId])];
            case 3:
                result = _c.sent();
                return [2 /*return*/, res.json(result.rows[0])];
            case 4: return [4 /*yield*/, (0, db_js_1.query)('INSERT INTO babies (user_id, name, birth_date, gender) VALUES ($1, $2, $3, $4) RETURNING *', [userId, name, birthDate, gender])];
            case 5:
                result = _c.sent();
                return [2 /*return*/, res.json(result.rows[0])];
            case 6: return [3 /*break*/, 8];
            case 7:
                err_2 = _c.sent();
                console.error(err_2);
                res.status(500).json({ error: 'Failed to save baby' });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
// --- TRACKERS ---
router.post('/trackers', (0, schemas_js_1.validateBody)(schemas_js_1.TrackerSchema), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, timestamp, babyId, result, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, type = _a.type, timestamp = _a.timestamp, babyId = _a.babyId;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, db_js_1.query)('INSERT INTO tracker_logs (baby_id, type, timestamp) VALUES ($1, $2, $3) RETURNING *', [babyId, type, new Date(timestamp)])];
            case 2:
                result = _b.sent();
                res.json(result.rows[0]);
                return [3 /*break*/, 4];
            case 3:
                err_3 = _b.sent();
                console.error(err_3);
                res.status(500).json({ error: 'Failed to save tracker' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// --- CHALLENGES ---
router.post('/challenges', (0, schemas_js_1.validateBody)(schemas_js_1.ChallengeSchema), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, challengeId, xp, babyId, userId, err_4;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, challengeId = _a.challengeId, xp = _a.xp, babyId = _a.babyId;
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, db_js_1.query)('INSERT INTO user_challenges (user_id, baby_id, template_id, xp_awarded, completed_at, status) VALUES ($1, $2, $3, $4, NOW(), $5)', [userId, babyId, challengeId, xp, 'completed'])];
            case 2:
                _c.sent();
                // Update User Points
                return [4 /*yield*/, (0, db_js_1.query)('UPDATE users SET points = points + $1 WHERE id = $2', [xp, userId])];
            case 3:
                // Update User Points
                _c.sent();
                res.json({ success: true });
                return [3 /*break*/, 5];
            case 4:
                err_4 = _c.sent();
                console.error(err_4);
                res.status(500).json({ error: 'Failed to complete challenge' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
