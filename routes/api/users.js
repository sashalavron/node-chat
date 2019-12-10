const express = require('express')
const router = express.Router()
const auth = require('../auth')
const mongoose = require('mongoose')
const Users = mongoose.model('Users')


const isRequiredField = field => ({ errors: { [field]: 'is required' } })

router.post('/', auth.optional, async (req, res, next) => {
  const { body } = req
  if (!body.user.email) {
    return res.status(422).json(isRequiredField('email'))
  }

  if (!body.user.password) {
    return res.status(422).json(isRequiredField('password'))
  }

  const alreadyExistedUser = await Users.findOne({ email: body.user.email })

  if (alreadyExistedUser) {
    return res.status(422).json({ errors: { user: 'already exists' } })
  }

  const newUser = new Users(body.user)
  newUser.setPassword(newUser.password)

  await newUser.save()

  return res.json({ user: newUser.toAuthJSON() })
})

router.post('/login', auth.optional, (req, res, next) => {
  const { body } = req

  if (!body.user.email) {
    return res.status(422).json(isRequiredField('email'))
  }

  if (!body.user.password) {
    return res.status(422).json(isRequiredField('password'))
  }

  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if(err) {
      return next(err);
    }

    if(passportUser) {
      const user = passportUser;
      return res.json({ user: user.toAuthJSON() });
    }

    return res.status(400).json(info);
  })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, async (req, res, next) => {
  const { payload: { id } } = req;
  const user = await Users.findById(id)

  if(!user) {
    return res.sendStatus(401);
  }

  return res.json({ user: user.toAuthJSON() });
});

module.exports = router;