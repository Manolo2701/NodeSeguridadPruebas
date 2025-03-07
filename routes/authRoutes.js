const router = require('express').Router();
const { refreshToken } = require('../middleware/auth');

router.post('/refresh', refreshToken, (req, res) => {
  res.json({ message: "Token actualizado" });
});

module.exports = router;