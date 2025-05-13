import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const UserSchema = new Schema({
    providerId: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    profilePic: { type: String },
    coverPic: { 
        type: String, 
        default: "https://cdn.dribbble.com/users/3212981/screenshots/6751662/untitled-10_4x.jpg"
    },
    provider: { type: String },
    stripeAccountId: { type: String },
    stripePublishableKey: { type: String },
    stripeAccessToken: { type: String }, // For OAuth connections
    project: { type: String },
    projectLink: { type: String },
    projectDescription: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Add index for better query performance
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });

export default models.User || model('User', UserSchema);