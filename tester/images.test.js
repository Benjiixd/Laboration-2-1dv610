const fs = require('fs'); // Node.js FileSystem module to read file
const path = require('path');
global.fetch = fetch; // Mock fetch globally
const uploadImage = require('./images');


test('uploading an image', async () => {
    const filePath = path.resolve(__dirname, './test.jpg');
    const file = fs.readFileSync(filePath);
    const formData = new FormData();
    formData.append('file', new Blob([file]), 'test.jpg');
    
    const response = await uploadImage(formData);
    expect(response.status).toBe(200);
});