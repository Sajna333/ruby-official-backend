exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    // Placeholder: integrate Stripe or PayPal here
    res.json({ client_secret: 'fake_client_secret_for_testing', amount });
  } catch (error) {
    console.error('Payment Error:', error.message);
    res.status(500).json({ error: 'Payment failed' });
  }
};
