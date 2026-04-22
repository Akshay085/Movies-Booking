import { Inngest } from "inngest";
import User from "../models/userModel.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk', event: 'clerk/user.created' }, 
    async ({ event }) => {
        const payload = event.data.data || event.data;
        const { id, first_name, last_name, email_addresses, image_url } = payload;
        const userData = {
            _id: id,
            email: email_addresses && email_addresses.length > 0 ? email_addresses[0].email_address : '',
            name: [first_name, last_name].filter(Boolean).join(' '),
            image: image_url || ''
        }
        await User.create(userData)
    }
)

//Inngest Function to delete from database

const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-with-clerk', event: 'clerk/user.deleted' }, 
    async ({ event }) => {
        const payload = event.data.data || event.data;
        const { id } = payload;
        await User.findByIdAndDelete(id)
    }
)

//Inngest Function to update data in database

const syncUserUpdation = inngest.createFunction(
    { id: 'update-user-from-clerk', event: 'clerk/user.updated' }, 
    async ({ event }) => {
        const payload = event.data.data || event.data;
        const { id, first_name, last_name, email_addresses, image_url } = payload;
        const userData = {
            _id: id,
            email: email_addresses && email_addresses.length > 0 ? email_addresses[0].email_address : '',
            name: [first_name, last_name].filter(Boolean).join(' '),
            image: image_url || ''
        }
        await User.findByIdAndUpdate(id, userData)
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation, 
    syncUserDeletion,
    syncUserUpdation
];