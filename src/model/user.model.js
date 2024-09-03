import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: false,
    },
    role: {
        type: Number,
        required: true,
        default: 2
    }
}, {
    timestamps: true,
    statics: {
        // create a new user
        createUser: async function (username, password, email) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new this({ username, password: hashedPassword, email });
            return await user.save();
        },
        // sign in 
        signIn: async function (username, password) {
            const user = await this.findOne({ username });
            if (!user) {
                throw new Error('Username does not exist.');
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Password is incorrect.');
            }
            return user;
        },
        // find user by id
        getUserById: async function (userId) {
            return await this.findById(userId);
        },
        // find user by email
        getUserByEmail: async function (email) {
            return await this.findOne({ email: email });
        },

        // update user
        updateUser: async function (userId, updatedUser) {
            // Check if there's a new password to hash
            if (updatedUser.password) {
                const hashedPassword = await bcrypt.hash(updatedUser.password, 10);
                updatedUser.password = hashedPassword;
            }
            // Find and update the user
            const user = await this.findByIdAndUpdate(userId, updatedUser, { new: true });
            return user;
        },
        // find all users
        getAllUsers: async function () {
            return await this.find({});
        }
    }
}
)

const User = mongoose.model('User', userSchema);

export default User

