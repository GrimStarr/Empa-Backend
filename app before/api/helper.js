const jwt = require('jsonwebtoken');

const AccountTable = require('../account/table');
const { APP_SECRET } = require('../../secrets');

const setToken = ({ id, username, passwordHash, res }) => {
    return new Promise((resolve, reject) => {
        const token = jwt.sign({ username, passwordHash }, APP_SECRET, { expiresIn: 600 });
        res.json({
            "username": username,
            "expiresIn": 600,
            "token": token,
            "localId": id
        });
    });
}

const deleteToken = ({ res }) => res.json({"token": null});

const authenticatedAccount = ({ token }) => {
    return new Promise((resolve, reject) => {
        if (!token) {
            const error = new Error('Invalid session');
            error.statusCode = 400;
            return reject(error);
        } else {
            const { username, passwordHash } = jwt.decode(token); //, APP_SECRET);
            let authenticated = false;
    
            AccountTable.getAccount({username})
                .then(({ account }) => {
                    if (account && account.passwordHash == passwordHash) {
                        authenticated = true;
                    }
                    resolve({ account, authenticated });
                })
                .catch(error => reject(error));
        }
    });
};

module.exports = { setToken, deleteToken, authenticatedAccount };
