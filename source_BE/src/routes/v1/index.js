const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const profileRoute = require('./profile.route');
const friendRoute = require('./friend.route');
const adminRoute = require('./admin.route');
const sortRoute = require('./sort.route');
const groupRoute = require('./group.route');

const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/admin',
    route: adminRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },

  {
    path: '/profile',
    route: profileRoute,
  },
  {
    path: '/friend',
    route: friendRoute,
  },
  {
    path: '/sort',
    route: sortRoute,
  },
  {
    path: '/group',
    route: groupRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
