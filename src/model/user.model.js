import mongoose from "mongoose";
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        require: false,
    },
    role: {
        type: Number,
        require: true,
        default: 2
    }
}, {
    timestamps: true,
}
)
// Phương thức so sánh mật khẩu
userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, callback);
};
const User = mongoose.model('User', userSchema);

export default User