// Used for: Creating a new account
async function login(data) {
    const response = await fetch('http://localhost:3020/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    console.log(response);
    return response.status;
    
}
module.exports = login;