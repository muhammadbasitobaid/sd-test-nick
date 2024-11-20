import {
    pick
} from 'lodash';

import {
    sign,
} from 'jsonwebtoken';


export const issueAuthToken = async (jwtPayload) => {
    let token = await sign(jwtPayload, process.env.JWT_SECRET, {
        expiresIn: 3600*24
    });
    return `Bearer ${token}`;
};

export const serializeUser = user => pick(user, [
    'id',
    'email',
    'username',
    'lastName',
    'firstName',
]);
