const { Router } = require('express');
const User = require('./../models/user');
const bcryptjs = require('bcryptjs');
const routeGuardMiddleware = require('./../middleware/route-guard');
const router = Router();

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.get('/profile', routeGuardMiddleware, (req, res, next) => {
  res.render('profile');
});

router.get('/profile/edit', routeGuardMiddleware, (req, res, next) => {
  res.render('edit-name');
});

router.post('/profile/edit', routeGuardMiddleware, (req, res, next) => {
  const firstName = req.body.firstName;
  const user = req.session;
  console.log(user);
  User.findByIdAndUpdate(user.userId, { firstName })
    .then(() => {
      res.redirect('/profile');
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/private', routeGuardMiddleware, (req, res, next) => {
  res.render('private');
});

router.get('/main', routeGuardMiddleware, (req, res, next) => {
  res.render('main');
});

router.post('/register', (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;
  bcryptjs
    .hash(password, 10)
    .then((passwordHashAndSalt) => {
      return User.create({
        name,
        passwordHashAndSalt
      });
    })
    .then((user) => {
      console.log('New user created', user);
      // Serialing the user
      req.session.userId = user._id;
      res.redirect('/profile');
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/log-in', (req, res) => {
  res.render('log-in');
});

router.post('/log-in', (req, res, next) => {
  const { name, password } = req.body;
  let user;
  User.findOne({ name })
    .then((document) => {
      user = document;
      if (!user) {
        throw new Error('ACCOUNT_NOT_FOUND');
      } else {
        return bcryptjs.compare(password, user.passwordHashAndSalt);
      }
    })
    .then((comparisonResult) => {
      if (comparisonResult) {
        console.log('User was authenticated');
        req.session.userId = user._id;
        res.redirect('/profile');
      } else {
        throw new Error('WRONG_PASSWORD');
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/log-out', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
