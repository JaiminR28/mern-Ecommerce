/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const crypto = require('crypto');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
// const jwt = require('jsonwebtoken');

const LocalStrategy = require('passport-local').Strategy;

const productsRouter = require('./routes/productsRouter');
const brandsRouter = require('./routes/brandsRouter');
const categoryRouter = require('./routes/categoryRouter');
const userRouter = require('./routes/UserRouter');
const authRouter = require('./routes/authRouter');
const cartRouter = require('./routes/cartRouter');
const orderRouter = require('./routes/ordersRouter');
const { Users } = require('./models/User');
const { isAuth, sanitizeUser } = require('./services/common');

const server = express();

// MIDDLEWARES

// JWT Options

const SECRET_KEY = 'SECRET_KEY';

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY; // TODO:  should not be in the code;

server.use(
  session({
    secret: 'Keyboard Cat',
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
server.use('/users', userRouter.router);
server.use('/auth', authRouter.router);
server.use('/cart', isAuth(), cartRouter.router);
server.use('/orders', isAuth(), orderRouter.router);

// passport Strategies
passport.use(
  'local',
  new LocalStrategy(async (username, password, done) => {
    // by default passport uses username
    try {
      const user = await Users.findOne({ email: username }).exec();
      if (!user) {
        done(null, false, { message: 'no such user email' });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        'sha256',
        async (err, hashedPassword) => {
          console.log(user);
          // this is just temp. , we will use strong password encription later

          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: 'Invalid Crendentials' });
          }
          // const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
          done(null); // this line sends user to serialize
        }
      );
    } catch (error) {
      done(error);
    }
  })
);

passport.use(
  'jwt',
  new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log({ jwt_payload });
    try {
      const user = await Users.findOne({ id: jwt_payload.sub });
      if (user) {
        return done(null, sanitizeUser(user)); // this calls serializer
      }
      return done(null, false);
      // or you could create a new account
    } catch (error) {
      return done(error, false);
    }
  })
);

// Serialize and deserilize user
// this creates session variables req.user on being called
passport.serializeUser((user, cb) => {
  console.log('serialize', user);
  process.nextTick(() =>
    cb(null, {
      id: user.id,
      role: user.role,
    })
  );
});

// this creates session variables req.user on being called from authorizeed request
passport.deserializeUser((user, cb) => {
  console.log('de-serialize', user);
  process.nextTick(() => cb(null, user));
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/ecommerce');
  // eslint-disable-next-line no-console
  console.log('Database connected Succesfully !!');
}

// eslint-disable-next-line no-console
main().catch(() => console.log('Could not connect to the database !!'));

server.listen(8000, () => {
  // eslint-disable-next-line no-console
  console.log('Server Started !!');
});
