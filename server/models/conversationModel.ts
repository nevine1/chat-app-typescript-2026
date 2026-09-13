import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        members: {   // Array of user IDs participating in the conversation
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            required: true,
            /*  validate: {
                 validator: (members: mongoose.Types.ObjectId[]) =>
                     members.length === 2,
                 message: "A conversation must have exactly two members"
             } */
        }
    },
    {
        timestamps: true
    }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;