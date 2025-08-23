import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: 'rzp_test_R800nyYb6EHdmN',
  key_secret: 'AmyIQT0BdBaQLIzT7r0cwNg5',
});

export async function POST(request) {
  try {
    const { amount, currency = 'INR' } = await request.json();

    const options = {
      amount: amount, // amount in paise
      currency: currency,
      receipt: 'order_' + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    return Response.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return Response.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
