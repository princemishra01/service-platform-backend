import express from 'express';
import { jwtDecode } from 'jwt-decode';
import client from '../services/intercomService.js';

const requestRouter = express.Router();

requestRouter.get('/', (req, res) => {

    let token;

    const authHeader = String(req.headers['authorization'] || '');

    if (authHeader.startsWith("Bearer ")){
        token = authHeader.substring(7, authHeader.length);
   } else {
      res.send("Please provide a valid token for logging in")
   }
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
        }).then(async response => {
            const contacts = response.data;
            if (contacts.length > 0) {
                const response = await client.conversations.search({
                    data: {
                        query: {
                            operator: "AND",
                            value: [
                                {
                                    field: "source.author.email",
                                    operator: "=",
                                    value : decoded.email
                                }
                            ],
                        }
                    },
                });
                const conversationsArray = response.conversations.map((conversation) => {
                    let cleanText = conversation.source.body.replace(/<\/?[^>]+(>|$)/g, "");
                    return {
                        id: conversation.id,
                        title: cleanText.substring(0, cleanText.indexOf('\n')),
                        description: cleanText.substring(cleanText.indexOf('\n') + 1),
                    }
                });
                res.send(conversationsArray);
            } else {
                res.send('Please login first');
            }
        });

    } catch (err) {
        res.send('Please provide a valid token for logging in', err);
    }
});

requestRouter.post('/', (req, res) => {
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
                client.conversations.create({
                    userId: contacts[0].id,
                    body: `${req.body.title} \n ${req.body.description}`,
                }).then(response => {
                    res.send(response);
                })
            } else {
                res.send('Please login first');
            }
        });

    } catch (err) {
        res.send('Please provide a valid token for logging in', err);
    }
    
});

export default requestRouter;