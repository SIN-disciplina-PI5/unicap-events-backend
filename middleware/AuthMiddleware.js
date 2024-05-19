var admin = require("firebase-admin");
var serviceAccount = require("../firebaseAdminCredentials.json");
const knex = require('knex');
const knexFile = require('../knexfile.js');
const db = knex(knexFile);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Middleware de autenticação
const AuthMiddleware = async (req, res, next) => {
    const token = req.headers['authorization'] ? req.headers['authorization'].replace('Bearer ', '') : null;
    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const authUser = await admin.auth().verifyIdToken(token);
        const user = await db('users').where('email', authUser.email).first();
        if(!user){
            return res.sendStatus(401);
        }
        req.authUser = user;
        next();

    } catch (e) {
        return res.sendStatus(401);
        
    }
};

module.exports = AuthMiddleware;