// models/userModel.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { 
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^[6-9]\d{9}$/.test(v);
            },
            message: props => `${props.value} is not a valid mobile number!`
        }
    },
    password: { type: String, required: true },
    image: { type: String, required: true },
    is_admin: { type: Number, required: true },
    is_verified: { type: Number, default: 0 },
    token: { type: String, default: '' },
});

module.exports = mongoose.model('User', userSchema);
