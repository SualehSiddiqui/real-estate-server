import User from "../../models/User.js";
import UserSchema from "../../joiModels/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
const expiresIn = '1d';

const createUser = async (user, res) => {
    try {
        //validating Joi Schema
        await UserSchema.validateAsync(user);
        const userExist = await User.findOne({ email: user.email });

        if (userExist) {
            //If user is already exist
            return res.status(400).send({ succes: false, message: "User with that email already exist" });
        }

        //Hashing password 
        const hashPassword = await bcrypt.hash(user.password, 10);
        //deleting password which is in letters
        delete user.password
        //creatin user
        const newUser = new User({ ...user, password: hashPassword });
        //saving user
        const savedUser = await newUser.save().then(res => res.toObject())
        //deleting password which is in hash
        delete savedUser.password
        // Creating Jwt token
        const token = jwt.sign(
            { _id: savedUser._id },
            process.env.JWT_SECRET,
            { expiresIn }
        )

        return res.status(200).send({ succes: true, message: "User Created", data: savedUser, token });
    } catch (error) {
        console.log("error", error)
        return res.status(error.status || 400).send({ success: false, message: error?.message });
    }
}

const validateUser = async (user, res) => {
    try {
        const userExist = await User.findOne({ email: user.email }).lean();
        if (!userExist) {
            return res.status(404).send({ success: false, message: "User does not exist" });
        }
        //compairing password
        const comparePassword = await bcrypt.compare(user.password, userExist.password)
        if (!comparePassword) {
            return res.status(401).send({ success: false, message: 'Invalid Email or Password' })
        }
        //deleting password  which is in hash
        delete userExist.password

        const token = jwt.sign(
            { _id: userExist._id },
            process.env.JWT_SECRET,
            { expiresIn }
        )

        return res.status(200).send({ success: true, message: "User Found", user: userExist, token })
    } catch (error) {
        console.log("error", error)
        return res.status(error.status || 400).send({ success: false, message: error?.message })
    }
}

const forgetPassword = async (email, res) => {
    try {
        let oldUser;
        oldUser = await User.findOne({ email });
        if (!oldUser) {
            const admin = await Admin.findOne({ email });
            if (!admin) {
                return res.status(200).send({ success: true, message: "User Not Exists" })
            }
            oldUser = admin;
        }

        const secret = process.env.JWT_SECRET + oldUser.password;
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
            expiresIn: "10m",
        });
        const link = `http://localhost:8000/api/auth/resetPassword/${oldUser._id}/${token}`;
        console.log('forget pass', link)

        //Sending mail to user through nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: process.env.USER,
                pass: process.env.APP_PASSWORD,
            },
        });

        const mailOptions = {
            from: {
                name: 'Zarovia Support',
                address: process.env.USER
            },
            to: oldUser.email, // List of receivers
            subject: "Password Reset Request", // Subject line
            text: '', // Plain text body
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset Request</title>
                </head>
                <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
                    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                        <div style="background-color: #007BFF; color: #ffffff; padding: 10px; border-radius: 8px 8px 0 0; text-align: center;">
                            <h2 style="margin: 0;">Password Reset Request</h2>
                        </div>
                        <div style="margin: 20px 0;">
                            <p style="margin: 0;">Dear ${oldUser.name},</p>
                            <p style="margin: 10px 0;">We received a request to reset the password for your account. To proceed with resetting your password, please click the link below:</p>
                            <p style="margin: 10px 0;"><a href="${link}" style="display: inline-block; background-color: #007BFF; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Your Password</a></p>
                            <p style="margin: 10px 0;">This link will redirect you to a page where you can set a new password. If you did not request this password reset, please ignore this email.</p>
                            <p style="margin: 10px 0;">If you have any questions or need further assistance, feel free to reply to this email or contact our support team.</p>
                        </div>
                        <div style="text-align: center; font-size: 12px; color: #777; margin-top: 20px;">
                            <p style="margin: 0;">Thank you for your attention.</p>
                        </div>
                    </div>
                </body>
                </html>
            `, // HTML body
            attachments: [] // No attachments
        };


        const sendMail = async (transporter, mailOptions) => {
            try {
                await transporter.sendMail(mailOptions);
                console.log('email has been sent!')
            } catch (error) {
                console.log(error)
            }
        };

        sendMail(transporter, mailOptions);
        res.status(200).send({ success: true, message: "Verification email has been sent to your Email Id" })
    } catch (error) {
        res.status(500).send({ success: false, message: error.message })
    }
}
const resetPasswordUi = async (id, token, res) => {
    try {
        let oldUser = await User.findById(id);
        if (!oldUser) {
            const admin = await Admin.findById(id);
            if (!admin) {
                return res.status(200).send({ success: true, message: "User Not Exists" });
            }
            oldUser = admin;
        }
        const secret = process.env.JWT_SECRET + oldUser.password;
        const verify = jwt.verify(token, secret);
        //Sending response to Frontend
        return res.render("resetPassword", { email: verify.email, status: "Not Verified" });
    } catch (error) {
        return res.status(500).send({ success: false, message: error.message })
    }
}
const resetPassword = async (id, token, password, res) => {
    try {
        let oldUser = await User.findById(id);
        if (!oldUser) {
            const admin = await Admin.findById(id)
            if (!admin) {
                return res.status(200).send({ success: true, message: "User Not Exists" })
            }
            oldUser = admin;
        }
        const secret = process.env.JWT_SECRET + oldUser.password;
        const verify = jwt.verify(token, secret);
        // Checking if new password is different from current password or not
        const comparePassword = await bcrypt.compare(password, oldUser.password);
        if (comparePassword) {
            return res.render("resetPassword", { email: verify.email, status: "Same Password" });
        }
        //Hashing password through bcrypt
        const encryptedPassword = await bcrypt.hash(password, 10);
        //Updating user
        let newUser = await User.findByIdAndUpdate(id, { password: encryptedPassword });
        if (!newUser) {
            newUser = await Admin.findByIdAndUpdate(id, { password: encryptedPassword });
        }
        //Deleting password from user object
        delete newUser.password

        return res.render("resetPassword", { email: verify.email, status: "Verified" });
    } catch (error) {
        console.log("error--->", error)
        return res.status(500).send({ success: false, message: error.message })
    }
}

const getOneUser = async (id, res) => {
    try {
        const userExist = await User.findById(id);

        if (!userExist) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }

        res.status(200).send({ success: true, message: 'User Found', user: userExist });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ success: false, message: error.message || 'Internal Server Error' });
    }
}

const updateUser = async (id, password, userObj, res) => {
    try {
        let updatedUser;
        const userExist = await User.findById(id);
        if (password === 'true') {
            let user;

            if (!userExist) {
                return res.status(404).send({ success: false, message: 'User not found' });
            }

            // Validate old password
            const isMatch = await bcrypt.compare(userObj.oldPassword, user.obj.password);
            if (!isMatch) {
                return res.status(400).send({ success: false, message: 'Incorrect old password' });
            }

            const oldPasswordMatch = await bcrypt.compare(userObj.newPassword, user.obj.password);
            if (oldPasswordMatch) {
                return res.status(400).send({ success: false, message: 'New password cannot be same same as old password' });
            }

            // Encrypt new password if provided
            if (userObj.newPassword) {
                const encryptedPassword = await bcrypt.hash(userObj.newPassword, 10);
                userObj.password = encryptedPassword;
                delete userObj.newPassword;
            }

            // Remove oldPassword as it's no longer needed
            delete userObj.oldPassword;

            updatedUser = await User.findByIdAndUpdate(id, userObj, { new: true }).lean();


            // Ensure no sensitive information is sent back
            if (updatedUser) {
                delete updatedUser.password;
            }

        } else {
            delete userObj.password

            if (!userExist) {
                return res.status(404).send({ success: false, message: 'User not found' });
            }

            updatedUser = await User.findByIdAndUpdate(
                id,
                userObj,
                {
                    new: true
                }
            )

            // Ensure no sensitive information is sent back
            if (updatedUser) {
                delete updatedUser.password;
            }
        }

        res.status(200).send({ success: true, message: 'User updated successfully', data: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ success: false, message: error.message || 'Internal Server Error' });
    }
};


export {
    createUser,
    validateUser,
    forgetPassword,
    resetPasswordUi,
    resetPassword,
    updateUser,
    getOneUser,
}