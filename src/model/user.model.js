import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        // require: true,
        trim: true
    },
    password: {
        type: String,
        require: false,
        trim: true,
    },
    role: {
        type: Number,
        // require: true,
    }
}, {
    timestamps: true,
    excludeIndexes: [

    ]
}
)

const User = mongoose.model('User', userSchema);

export default User