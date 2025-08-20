const express = require("express");
const { userAuth } = require("../middleware/auth");

const paymentRouter = express.Router();
const razorPayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const User = require("../models/user");
const { membershipAmount } = require("../utils/constant");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;
    const order = await razorPayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType,
      },
    });

    // store into database
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });
    const savedPayment = await payment.save();
    // retuen back to frontend
    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

paymentRouter.post("/payment/webook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");

    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid)
      return res.status(400).json({ msg: "webhook signature is invalid!" });
    console.log(000, req);
    // update payment in the db
    const paymentDetails = req.body.payload.payment.entity;
    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();

    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    await user.save();
    // update user as premium

    // return success response to razorpay
    if (req.body.event === "payment.captured") {
      console.log("captured");
    }
    if (req.body.event === "payment.failed") {
      console.log("failed");
    }

    return res.status(200).json({ msg: "Webhook received successfully!" });
  } catch (err) {
    //
  }
});

paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  const user = req.user.toJSON();
  if (user.isPremuim) return res.json({ ...user });
  return res.json({ ...user });
});

module.exports = paymentRouter;
