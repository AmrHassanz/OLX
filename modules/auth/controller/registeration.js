const userModel = require('../../../DB/model/user');
const sendEmail = require('../../../services/email')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// sign up 
const signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, gender, password } = req.body;
        const newUser = new userModel({ firstName, lastName, email, phone, gender, password });
        const savedUser = await newUser.save();
        console.log({ user: savedUser })
        // send confirmation email
        const token = jwt.sign({ id: savedUser._id }, process.env.emailToken, { expiresIn: 5 * 60 }); // five min
        const link = `${req.protocol}://${req.headers.host}/api/v1/auth/confirmEmail/${token}`;
        const link2 = `${req.protocol}://${req.headers.host}/api/v1/auth/refreshEmail/${savedUser._id}`;
        const message = `<a href='${link}'>plz follow me to confirm u account</a>
        <br>
        <a href='${link2}'>re-send confirmation email</a>
        `;
        sendEmail(savedUser.email, message);

        res.status(201).json({ message: 'Done' });
    } catch (error) {
        if (error.keyValue?.email) {
            res.status(409).json({ message: 'email exist' });
        } else {
            res.status(500).json({ message: 'catch error', error });
        }
    }
}

// confirm email
const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.emailToken);
        if (!decoded) {
            res.status(400).json({ message: 'in-valid token' });
        } else {
            const user = await userModel.findById(decoded.id).select('confirmEmail');
            if (!user) {
                res.status(404).json({ message: 'in-valid token id' });
            } else {
                if (user.confirmEmail) {
                    res.status(400).json({ message: 'u already confirmed plz procced to login page' });
                } else {
                    const confirmedUser = await userModel.findOneAndUpdate({ _id: user._id }, { confirmEmail: true });
                    res.status(200).json({ message: 'Done plz login' });
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch error', error });
    }
}

// re-fresh email
const refreshEmail = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.findById(id).select('confirmEmail email');
        if (!user) {
            res.status(404).json({ message: 'in-valid account' });
        }
        else {
            if (user.confirmEmail) {
                res.status(400).json({ message: 'u already confirmed plz procced to login page' });
            }
            else {
                const token = jwt.sign({ id: user._id }, process.env.emailToken, { expiresIn: 5 * 60 }); // five min
                const link = `${req.protocol}://${req.headers.host}/api/v1/auth/confirmEmail/${token}`;
                const link2 = `${req.protocol}://${req.headers.host}/api/v1/auth/refreshEmail/${user._id}`;
                const message = `<a href='${link}'>plz follow me to confirm u account</a>
            <br>
            <a href='${link2}'>re-send confirmation email</a>
            `;
                sendEmail(user.email, message);
                res.status(200).json({ message: 'Done plz login' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'Catch error', error });
    }
}


// login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'in-valid account email' });
        } else if (!user.confirmEmail) {
            res.status(400).json({ message: 'plz confirm your email fisrt' });
        } else if (user.isBlocked) {
            res.status(400).json({ message: 'sorry this account is blocked' })
        } else if (user.isDeleted) {
            res.status(400).json({ message: 'sorry this account is temporarily Disabled , contact us for more information' });
        } else {
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                res.status(400).json({ message: 'email password misMTCH' });
            } else {
                const token = jwt.sign({ id: user._id, isLoggedIn: true }, process.env.loginToken, { expiresIn: '24hr' });
                await userModel.findOneAndUpdate({ _id: user._id }, { isOnline: true });
                res.status(200).json({ message: 'login success', token });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'Catch error', error });
    }
}

// Forget Password
// 1- send code
const sendCode = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'in-valid email' });
        }
        else {
            const code = Math.floor(1000 + Math.random() * 9000);
            await userModel.findByIdAndUpdate(user._id, { code }, { new: true });
            //       destination
            sendEmail(user.email, `<p>use this code to update u password : ${code}</p>`);
            res.status(200).json({ message: 'Done' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Catch error', error });
    }
}
// 2- forget password
const forgetPassword = async (req, res) => {
    try {
        const { code, email, newPassword } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'in-valid email' });
        }
        else {
            if (user.code != code) {
                res.status(400).json({ message: 'in-valid auth code' });
            }
            else {
                const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.saltRound));
                await userModel.findOneAndUpdate({ _id: user._id }, { password: hashedPassword, code: '' }, { new: true });
                res.status(200).json({ message: 'Done' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'Catch error', error });
    }
}

// logout
const logOut = async (req, res) => {
    try {
        const user = await userModel.findByIdAndUpdate(req.user._id, { isOnline: false, lastSeen: Date.now() });
        res.status(200).json({ message: 'Done' });
    } catch (error) {
        res.status(500).json({ message: 'Catch error', error });
    }
}




module.exports = { signUp, confirmEmail, login, refreshEmail, sendCode, forgetPassword, logOut };