import Intercom from 'intercom-client';
import dotenv from 'dotenv';
dotenv.config();

const client = new Intercom.Client({tokenAuth : {token : `${process.env.INTERCOM_ACCESS_TOKEN}`}});
client.useRequestOpts({
    headers: {
        'Intercom-Version': 2.6,
    },
});

export default client;