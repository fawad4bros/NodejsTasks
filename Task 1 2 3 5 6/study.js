const Joi = require("@hapi/joi");
const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    account_type: Joi.string(),
  });
  return schema.validate(data);
};
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });
  return schema.validate(data);
};
function validateRequest(req, next, schema) {
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };
  const { error, value } = schema.validate(req.body, options);
  if (error) {
    next(`Validation error: ${error.details.map((x) => x.message).join(", ")}`);
  } else {
    req.body = value;
    next();
  }
}
module.exports = {
  registerValidation,
  loginValidation,
  validateRequest,
};


router.patch("/update_user/:id", verifyToken, async (req, res, next) => {
  try {
    let userTemp = await User.findById(req.params.id);
    if (
      req.body.newpassword !== null &&
      req.body.newpassword !== undefined &&
      req.body.newpassword !== ""
    ) {
      const validPassword = await bcrypt.compare(
        req.body.oldpassword,
        userTemp.password
      );
      if (!validPassword) {
        return res.status(400).json({ error: "OLD Password is wrong" });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(req.body.newpassword, salt);
        userTemp.password = hashpassword;
      }
    }
    if (req.body.username) {
      userTemp.username = req.body.username;
    }
    // if (req.body.email) {
    //   const isEmailExist = await User.findOne({
    //     email: req.body.email,
    //   });
    //   if (isEmailExist)
    //     return res.status(400).json({ error: "Email already exists" });
    //   userTemp.email = req.body.email;
    // }
    if (req.body.message_notification) {
      userTemp.message_notification = req.body.message_notification;
    }
    if (req.body.nudge_notification) {
      userTemp.nudge_notification = req.body.nudge_notification;
    }
    if (req.body.app_notification) {
      userTemp.app_notification = req.body.app_notification;
    }
    if (req.body.status) {
      userTemp.status = req.body.status;
    }
    await userTemp.save();
    return res.status(200).json({
      error: false,
      userTemp,
      message: "User info updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
router.patch("/update_account/:id", verifyToken, async (req, res, next) => {
  try {
    let userTemp = await User.findById(req.params.id);
    const email = userTemp.email;
    const stripeaccount = await stripe.accounts.create({
      type: "express",
      email: email,
      country: "GB",
      default_currency: "GBP",
      business_type: "individual",
      capabilities: {
        transfers: { requested: true },
        card_payments: { requested: true },
      },
    });
    console.log(stripeaccount);
    userTemp.stripe_account = stripeaccount.id;
    await userTemp.save();
    const accountLink = await stripe.accountLinks.create({
      account: stripeaccount.id,
      refresh_url: "https://shareashelf.com/welcome",
      return_url: "https://shareashelf.com/welcome",
      type: "account_onboarding",
    });
    res.json({ accountLink });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});