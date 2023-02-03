const bcrypt = require("bcrypt");
const { User } = require("../app/user/models/user");
class Utility {
    constructor() {}
    genHash = async (password) => {
       return bcrypt.hashSync(password, 8);
    }
    compareHash = async (password, hashedPassword) => {
        return bcrypt.compareSync(password, hashedPassword);
    }
    checkEmail = async (email) => {
        const user = await User.findOne({ email: email });
        return user ? true: false
    }
    checkPassword = (password) => {
        return  password.length <= 8 ? true : false
    }
    checkRecord =  async (data) => {
        const record =  await User.findOne(data);
        return record === null ? false : true
    }
}

module.exports = new Utility();
