const fs = require('fs'); // Node.js FileSystem module to read file
const path = require('path');
global.fetch = fetch; // Mock fetch globally
const uploadImage = require('./images');


test('uploading an image', async () => {
    const filePath = path.resolve(__dirname, './test.jpg'); // Path to your test image
    const file = fs.readFileSync(filePath); // Read the image file

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', new Blob([file]), 'test.jpg'); // Append the image as Blob

    // Call the function to upload the image
    const response = await uploadImage(formData);

    // Check if the status code is 200 (OK)
    expect(response.status).toBe(200);
});