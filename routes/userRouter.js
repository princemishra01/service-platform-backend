import express from 'express';
import { jwtDecode } from 'jwt-decode';
import client from '../services/intercomService.js';

const userRouter = express.Router();

userRouter.post('/', (req, res) => {
    const token = req.body.authToken;
    const decoded = jwtDecode(token);
    
    try {
        client.contacts.search({
            data:{
                query: {
                    operator: 'AND',
                    value : [{
                        field: 'email',
                        operator: '=',
                        value: decoded.email
                    }]
                }
            }
        }).then(response => {
            const contacts = response.data;
            if (contacts.length > 0) {
                // console.log('Found contact:', contacts[0].id);
            } else {
                client.contacts.createUser({
                    email: decoded.email,
                    id: decoded.email,
                    name: decoded.name,
                }).then(response => {
                    // console.log(response);
                });
            }
        });
        res.send('Hello user');

    } catch (err) {
        res.send('Please provide a valid token for logging in', err);
    }
});

export default userRouter;