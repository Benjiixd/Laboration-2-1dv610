// Used for: Creating a new account
async function createAccount(data) {
    const response = await fetch('http://localhost:3020/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    
    return response.status;
    
}
module.exports = createAccount;