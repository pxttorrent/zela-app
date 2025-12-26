"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
// Mock Checkout Session
router.post('/create-checkout-session', function (req, res) {
    var planId = req.body.planId;
    // In real app: const session = await stripe.checkout.sessions.create(...)
    res.json({ url: 'https://checkout.stripe.com/mock-url-for-demo' });
});
// Mock Webhook
router.post('/webhook', function (req, res) {
    // Verify signature...
    // Handle event...
    console.log('Payment Webhook Received', req.body);
    res.json({ received: true });
});
exports.default = router;
