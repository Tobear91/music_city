const User = require("../models/users");

const saveAccessData = async (email, accessData) => {
  const user = await User.findOne({ email });

  if (!user?.discogs) {
    user.discogs_auth = accessData;
    await user.save();
  }
};

module.exports = { saveAccessData };
