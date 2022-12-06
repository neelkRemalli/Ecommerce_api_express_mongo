import CustomApiError from '../config/customApi.js';
import Order from '../models/orderSchema.js';
import Product from '../models/productSchema.js';

///// fake Stripe ///////
const fakeStripeAPI = async({amount, currency})=>{
    const client_secret = 'someRandomValue'
    return {client_secret, amount}
}

////////// Create order //////////
export const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomApiError(`No cart items provided`, 400);
  }
  if (!tax || !shippingFee) {
    throw new CustomApiError(`Please provide tax and shippingFee`);
  }
  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });

    if (!dbProduct) {
      throw new CustomApiError(`Product not found`, 400);
    }
    const { name, price, image, _id } = dbProduct;
    const SingleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product:_id,
    };
    orderItems = [...orderItems, SingleOrderItem]
    subtotal += item.amount * price;
  }
  const total = tax + shippingFee + subtotal;

    const paymentIntent = await fakeStripeAPI({amount:total, currency: 'usd'})
    
    const order = await Order.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        clientSecret: paymentIntent.client_secret,
        user: req.user.userId
    })

    
    res.status(201).json({order,client_secret:order.clientSecret});

};

////////// Get all order //////////
export const getAllOrders = async (req, res) => {
    const orders = await Order.find();
  res.status(200).json(orders);
};
////////// Get single order //////////
export const getSingleOrder = async (req, res) => {
    const order = await Order.findById(req.params.id)
    if(!order){
        throw new CustomApiError(`Order not found`, 404)
    }
    if(req.user.role === 'admin' || order.user.toString() === req.user.userId){

        res.status(200).json(order);
    }else{
        throw new CustomApiError(`Not authorized to deleted this review`, 403);
    }
};
////////// Get current order //////////
export const getCurrentUserOrders = async (req, res) => {
    const order = await Order.find({user:req.user.userId})
    if(!order){
        throw new CustomApiError(`Order not found`, 404)
    }
  res.status(200).json(order);
};

////////// update order //////////
export const updateOrder = async (req, res) => {
    const {paymentIntentId} = req.body;
    const order = await Order.findById(req.params.id)
    if(!order){
        throw new CustomApiError(`Order not found`, 404)
    }
    if(req.user.role === 'admin' || order.user.toString() === req.user.userId){
       order.paymentIntentId = paymentIntentId;
       order.status = 'paid'
       await order.save()

        res.status(200).json(order);
    }else{
        throw new CustomApiError(`Not authorized to deleted this review`, 403);
    }
};
