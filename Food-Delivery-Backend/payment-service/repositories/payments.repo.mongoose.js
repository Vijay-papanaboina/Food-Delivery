import { Payment } from "../db/mongoose-schema.js";

export async function upsertPayment(p) {
  const paymentData = {
    orderId: p.orderId,
    amount: p.amount,
    method: p.method,
    userId: p.userId,
    status: p.status,
    transactionId: p.transactionId || null,
    failureReason: p.failureReason || null,
    createdAt: p.createdAt ? new Date(p.createdAt) : undefined,
    processedAt: p.processedAt ? new Date(p.processedAt) : null,
  };

  // Remove undefined fields
  Object.keys(paymentData).forEach(
    (key) => paymentData[key] === undefined && delete paymentData[key]
  );

  const result = await Payment.findOneAndUpdate(
    { orderId: p.orderId },
    paymentData,
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  ).lean();

  return {
    ...result,
    payment_id: result._id.toString(),
    order_id: result.orderId,
    user_id: result.userId,
    transaction_id: result.transactionId,
    failure_reason: result.failureReason,
    created_at: result.createdAt,
    processed_at: result.processedAt,
  };
}

// Update only selected fields on an existing payment row
export async function updatePaymentFields(paymentId, fields) {
  const updateSet = {};
  if (fields.status !== undefined) updateSet.status = fields.status;
  if (fields.method !== undefined) updateSet.method = fields.method;
  if (fields.processedAt !== undefined)
    updateSet.processedAt = fields.processedAt
      ? new Date(fields.processedAt)
      : null;
  if (fields.transactionId !== undefined)
    updateSet.transactionId = fields.transactionId;
  if (fields.failureReason !== undefined)
    updateSet.failureReason = fields.failureReason;

  await Payment.findByIdAndUpdate(paymentId, updateSet);
}

export async function getPaymentByOrderId(orderId) {
  const payment = await Payment.findOne({ orderId })
    .sort({ createdAt: -1 })
    .lean();

  if (!payment) return null;

  return {
    payment_id: payment._id.toString(),
    order_id: payment.orderId,
    amount: payment.amount,
    method: payment.method,
    user_id: payment.userId,
    status: payment.status,
    transaction_id: payment.transactionId,
    failure_reason: payment.failureReason,
    created_at: payment.createdAt,
    processed_at: payment.processedAt,
  };
}

export async function getPayments(filters = {}) {
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.method) query.method = filters.method;
  if (filters.userId) query.userId = filters.userId;

  let q = Payment.find(query).sort({ createdAt: -1 });
  if (filters.limit) {
    q = q.limit(Number(filters.limit));
  }

  const payments = await q.lean();
  return payments.map((p) => ({
    payment_id: p._id.toString(),
    order_id: p.orderId,
    amount: p.amount,
    method: p.method,
    user_id: p.userId,
    status: p.status,
    transaction_id: p.transactionId,
    failure_reason: p.failureReason,
    created_at: p.createdAt,
    processed_at: p.processedAt,
  }));
}

export async function getPaymentStats() {
  const [
    total,
    successful,
    failed,
    pending,
    processing,
    sumSuccess,
    avgSuccess,
  ] = await Promise.all([
    Payment.countDocuments(),
    Payment.countDocuments({ status: "success" }),
    Payment.countDocuments({ status: "failed" }),
    Payment.countDocuments({ status: "pending" }),
    Payment.countDocuments({ status: "processing" }),
    Payment.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Payment.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, avg: { $avg: "$amount" } } },
    ]),
  ]);

  const totalAmount = sumSuccess.length > 0 ? sumSuccess[0].total : 0;
  const averageAmount = avgSuccess.length > 0 ? avgSuccess[0].avg : 0;
  const successRate =
    total > 0 ? parseFloat(((successful / total) * 100).toFixed(2)) : 0;

  return {
    total,
    successful,
    failed,
    pending,
    processing,
    totalAmount: Number(totalAmount.toFixed(2)),
    averageAmount: Number(averageAmount.toFixed(2)),
    successRate,
  };
}

export async function getPaymentsCount() {
  return await Payment.countDocuments();
}
