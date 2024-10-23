const createAccount = require('./createAccount');
const login = require('./login');
const random = Math.floor(Math.random() * 1000);

test('creating a account', async () => {
    const data = {
        username: random,
        password: 'test',
    };
    createAccount(data).then(response => {
        expect(response).toEqual(200); });
    }
);

test('creating a account with the same username', async () => {
    const data = {
        username: random,
        password: 'test',
    };
    createAccount(data).then(response => {
        expect(response).toEqual(400); });
    }
)

test('logging in', async () => {
    const data = {
        username: random,
        password: 'test',
    };
    login(data).then(response => {
        expect(response).toEqual(200); });
    }
);

test('logging in with the wrong password', async () => {
    const data = {
        username: random,
        password: 'wrong',
    };
    login(data).then(response => {
        expect(response).toEqual(401); });
    }
)

test('logging in with the wrong username', async () => {
    const data = {
        username: random + 1,
        password: 'test',
    };
    login(data).then(response => {
        expect(response).toEqual(404); });
    }
)
    