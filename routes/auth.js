const jwt = require('express-jwt');

const getToken = ({ headers }) => {
  const { authorization } = headers

  if(authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1];
  }
  return null;
};

const auth = {
  required: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken,
  }),
  optional: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken,
    credentialsRequired: false,
  }),
};

module.exports = auth;