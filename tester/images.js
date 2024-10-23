// function to post to /images with a image named test.png

const fs = require('fs'); // Node.js FileSystem module to read file
const path = require('path');


async function uploadImage(data) {
    const response = await fetch('http://localhost:3020/images', {
        method: 'POST',
        body: data, // Sending FormData
    });
    return response;
}

module.exports = uploadImage;