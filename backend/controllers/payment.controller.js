const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;

// Create payment session
const createPaymentSession = async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return res.status(503).json({
        error: 'Payment service not configured',
        message: 'Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.'
      });
    }
    
    const data = req.body;
    
    // Create product
    const product = await stripe.products.create({
      name: `${data.data.seat} Class Ticket(s)`
    });

    if (!product) {
      throw new Error('Failed to create product');
    }
    
    // Create price
    const price = await stripe.prices.create({
      product: `${product.id}`,
      unit_amount: data.data.price * 100,
      currency: 'INR',
    });
    
    if (!price.id) {
      throw new Error('Failed to create price');
    }
    
    // Determine the base URL based on environment
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://flyhigh-gamma.vercel.app'
      : 'http://localhost:5173';
    
    const Data = encodeURIComponent(JSON.stringify(data));
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: `${price.id}`,
          quantity: data.data.passengers
        }
      ],
      mode: "payment",
      success_url: `${baseUrl}/eticket?info=${Data}`,
      cancel_url: `${baseUrl}/`,
      customer_email: data.user.email,
    });
    
    if (!session || !session.url) {
      throw new Error('Failed to create checkout session');
    }
    
    res.json(session);

  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ 
      error: 'Payment processing failed', 
      message: error.message 
    });
  }
};

module.exports = {
  createPaymentSession
};

