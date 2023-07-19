/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */

const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const crypto = require('crypto');
const JwtStrategy = require('passport-jwt').Strategy;
// const { ExtractJwt } = require('passport-jwt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');

const LocalStrategy = require('passport-local').Strategy;

const productsRouter = require('./routes/productsRouter');
const brandsRouter = require('./routes/brandsRouter');
const categoryRouter = require('./routes/categoryRouter');
const userRouter = require('./routes/UserRouter');
const authRouter = require('./routes/authRouter');
const cartRouter = require('./routes/cartRouter');
const orderRouter = require('./routes/ordersRouter');
const { Users } = require('./models/User');
const { isAuth, sanitizeUser, cookieExtractor } = require('./services/common');

const server = express();

// MIDDLEWARES
dotenv.config({ path: './config.env' });

server.use(express.static(path.resolve(__dirname, 'build')));
server.use(cookieParser());
// JWT Options

// Payment Webhook
// This is your Stripe CLI webhook secret for testing your endpoint locally.
// TODO: we will capture actual order after  deploying out server live
const endpointSecret = process.env.WEBHOOK_ENDPOINT;

server.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        // eslint-disable-next-line no-case-declarations
        const paymentIntentSucceeded = event.data.object;
        console.log({ paymentIntentSucceeded });
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

// ...

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.SECRET_KEY; // TODO:  should not be in the code;

server.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // don't save session if modified
    saveUninitialized: false, // don't create session until something stored
  })
);

server.use(passport.authenticate('session'));

server.use(
  cors({
    exposedHeaders: ['X-Total-Count'],
  })
);

server.use(morgan('dev'));

server.use(express.json()); // to parse req.body

server.use('/products', isAuth(), productsRouter.router);
server.use('/categories', isAuth(), categoryRouter.router);
server.use('/brands', isAuth(), brandsRouter.router);
server.use('/users', isAuth(), userRouter.router);
server.use('/auth', authRouter.router);
server.use('/cart', isAuth(), cartRouter.router);
// this /orders is clashing with react /orders
server.use('/orders', isAuth(), orderRouter.router);
// this line we add to make react router work in case of other routes doesn;t match
server.get('*', (req, res) =>
  res.sendFile(path.resolve('build', 'index.html'))
);
// passport Strategies
passport.use(
  'local',
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      // by default passport uses username
      try {
        const user = await Users.findOne({ email: email });
        // console.log(email, password, user);
        if (!user) {
          return done(null, false, { message: 'invalid credentials' }); // for safety
        }
        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          'sha256',
          async (err, hashedPassword) => {
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
              return done(null, false, { message: 'invalid credentials' });
            }
            const token = jwt.sign(sanitizeUser(user), process.env.SECRET_KEY);
            console.log(user, token);
            done(null, { id: user.id, role: user.role, token }); // this lines sends to serializer
          }
        );
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  'jwt',
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await Users.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user)); // this calls serializer
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

// Serialize and deserilize user
// this creates session variables req.user on being called
passport.serializeUser((user, cb) => {
  process.nextTick(() =>
    cb(null, {
      id: user.id,
      role: user.role,
    })
  );
});

// this creates session variables req.user on being called from authorizeed request
passport.deserializeUser((user, cb) => {
  process.nextTick(() => cb(null, user));
});

// Payments

// This is your test secret API key.
// eslint-disable-next-line import/order, node/no-extraneous-require
const stripe = require('stripe')(process.env.STRIPE_ENDPOINT);

server.post('/create-payment-intent', async (req, res) => {
  const { totalAmount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100, // for decimal compensation
    currency: 'inr',
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

async function main() {
  await mongoose.connect(process.env.MONGODB_DATABASE);
  // eslint-disable-next-line no-console
  console.log('Database connected Succesfully !!');
}

// eslint-disable-next-line no-console
main().catch(() => console.log('Could not connect to the database !!'));

server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Server Started !!');
});
