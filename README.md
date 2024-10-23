# Laboration-3-1dv610

Laboration 3, an app

## Description

This is an app designed to serve as a digital wardrobe, created for people like me, who, due to their partner, have to keep all their clothes stuffed into a drawer...

## Installation

- Clone the repository
- Open two terminals within the repository
- Switch one terminal to the `/frontend` directory and the other to `/imagesaver`
- Run `npm i` in both terminals
- In `/imagesaver`, run `npm run start`
- In `/frontend`, run `npm run build`, followed by `npm run start`
- Ensure that the frontend server is running on localhost:3000
- Open localhost:3000 in a web browser and use the app

## Kravspecifikation

<table><thead>
  <tr>
    <th>Krav/Önskemål</th>
    <th>K/Ö</th>
    <th>Vikt</th>
    <th>Kommentar</th>
    <th>Test</th>
  </tr></thead>
<tbody>
  <tr>
    <td>En användare ska kunna skapa ett konto och logga in</td>
    <td>K</td>
    <td>N/A</td>
    <td>Ingen säkerhet bedömns inom kravet</td>
    <td>TC1.1-2.2</td>
  </tr>
  <tr>
    <td>En inloggad användare ska kunna ladda upp en bild</td>
    <td>K</td>
    <td>N/A</td>
    <td></td>
    <td>TC 3.1</td>
  </tr>
  <tr>
    <td>Enbart bilder ska kunna laddas&nbsp;&nbsp;upp</td>
    <td>Ö</td>
    <td>3</td>
    <td></td>
    <td>TC 3.2</td>
  </tr>
  <tr>
    <td>En användare ska kunna se sina bilder</td>
    <td>K</td>
    <td>N/A</td>
    <td></td>
    <td>TC 4.1-TC4.2</td>
  </tr>
  <tr>
    <td>En användare ska kunna ändra status på bilden</td>
    <td>K</td>
    <td>N/A</td>
    <td></td>
    <td>TC 5.1</td>
  </tr>
  <tr>
    <td>Koden skall följa code quality boken så mycket som möjligt</td>
    <td>Ö</td>
    <td>5</td>
    <td></td>
    <td>N/A</td>
  </tr>
  <tr>
    <td>Alla automatiserade tester skall gå igenom</td>
    <td>Ö</td>
    <td>4</td>
    <td></td>
    <td>Se "automatiserat test"</td>
  </tr>
</tbody></table>

## Backend Endpoints

### ImageSaver

- **Post**:
  - Post to `/images`
  - Include a file with the name "file"
  - Post the request

- **Get**:
  - Send a GET request to `/images/:id`
  - Replace ":id" with the ID of the image you want to retrieve
  - Send the request

- **Delete**:
  - Send a DELETE request to `/images/:id` with the ID of the image you want to delete

- **Post**:
  - Post to `/images/changeIsDirty` with the image ID in the body.

### UserSaver

- **Post**: Send a POST request to `/users/images` to retrieve a user's images

- **Post**: Send a POST request to `/users/create` with a "username" and a "password" to create a new account

- **Post**: Send a POST request to `/users/login` with a "username" and a "password" to log in a user. The server responds with a JWT

- **Post**: Send a POST request to `/users/verify` to verify a JWT

- **Post**: Send a POST request to `/users/addimage` with "username" and "imageid" in the body to add an image to a user.

## Frontend

The frontend consists of a Next.js project using React. The frontend mainly displays buttons and leaves validation and other tasks to the backend.

The one important function handled by the frontend is JWT verification, which is done in the `middleware.js` file:

```javascript
import { NextResponse } from 'next/server';
import { jwtVerify, importSPKI } from 'jose';

const PUBLIC_KEY = process.env.PUBLIC_KEY;

// Function to convert PEM to CryptoKey
async function getCryptoKey(pem) {
  try {
    const cryptoKey = await importSPKI(pem, 'RS256');
    return cryptoKey;
  } catch (error) {
    console.error("Error converting PEM to CryptoKey:", error);
    throw error;
  }
}

export default async function middleware(req) {
  if (req.nextUrl.pathname.startsWith('/_next') || req.nextUrl.pathname.includes('.')) {
    return NextResponse.next();
  }
  const token = req.cookies.get('token')?.value;
  if (!token) {
    const response = NextResponse.next();
    response.cookies.set('auth-status', 'no-token');
    return response;
  }
  try {
    const cryptoKey = await getCryptoKey(PUBLIC_KEY);
    const { payload } = await jwtVerify(token, cryptoKey);
    const response = NextResponse.next();
    response.cookies.set('auth-status', JSON.stringify(payload));
    return response;
  } catch (err) {
    const response = NextResponse.next();
    response.cookies.set('auth-status', 'invalid-token');
    return response;
  }
}
```

Also in `tokenReader.js`, which helps extract a username from a token:

```javascript
export function getNameFromToken(token) {
  try {
    const parsedAuthStatus = JSON.parse(token); // Parse the JSON string
    if (parsedAuthStatus && parsedAuthStatus.username) {
      const username = parsedAuthStatus.username;
      return username;
    }
  } catch (error) {
    console.error('Error parsing auth-status cookie:', error);
  }
}
```

Other than this, the frontend is mainly a simple interface.

## Backend

The backend consists of two separate "apps," which are located in the folders `ImageSaver` and `UserSaver`.

The `ImageSaver` comes from the previous assignment and is mostly the same module, with a few tweaks.

The `UserSaver` endpoint is primarily responsible for creating, authenticating, and managing users.

## ImageSaver

### Importing

```javascript
import { ImageController } from '../imageSaver/imageController.js';
import { imageModel } from '../imageSaver/imageModel.js';
```

### Creating a controller object

Note: A mongoose object needs to be connected before use. This setup ensures that your app is properly configured.

```javascript
const controller = new ImageController(ImageModel);
const app = controller.initializeApp(); // Initializes an express app for use
```

### Upload an image to the database

```javascript
const file = req.body.file; // As long as it's a file, it will work
const metadata = {
  title: req.body.title,
  description: req.body.description,
  owner: req.body.owner,
  isDirty: false
};
const data = controller.saveImage(file, metadata);
console.log(data); // The newly saved object
```

### Retrieve an image from the database

```javascript
const fileId = req.params.fileId;
const data = controller.getImage(fileId);
res.setHeader('metadata', JSON.stringify(data.metadata)); // Sets a header with the metadata
data.image.pipe(res); // Sends the image to the client

// Or if you want to reuse the image file
const image = data.image;
```

### Delete an image from the database

```javascript
const fileId = req.params.fileId;
const data = controller.deleteImage(fileId);
console.log(data); // If successful, data = 1
if (data === 1) {
  console.log("Success");
} else {
  console.log("Error");
}
```

### Update `isDirty`

```javascript
const fileId = req.body.id;
const result = await this.saver.changeIsDirty(fileId);
if (result === 1) {
  return res.status(200).send('Image updated successfully');
}
```

### The image object

```javascript
const schema = new mongoose.Schema({
  filename: { // The filename
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  fileId: { // The fileId linked to GridFS
    type: String,
    required: false
  },
  mimetype: { // Image type
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  size: { // Size in bytes
    type: Number,
    required: true
  },
  uploadedAt: {
    type: Date,
    required: true
  },
  updatedAt: {
    type: Date,
    required: true
  },
  metadata: {
    type: Object,
    required: false
  }
});
```

## UserSaver

Since `UserSaver` is only called by API requests, the fetch calls are shown below:

### Create a new user

```javascript
const onCreate = async (data) => {
  try {
    const response = await fetch('http://localhost:3020/users/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (response.status === 200) {
      window.location.reload(); // On success, reload to login page
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Log in a user

```javascript
const onSignIn = async (data) => {
  try {
    const response = await fetch('http://localhost:3020/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const responseData = await response.json();
    Cookies.set('token', responseData.token); // Set token as cookie
    router.push('/'); // Redirect to homepage
    setLoginFailed(false); // Update state
  } catch (error) {
    setLoginFailed(true);
  }
};
```

### Add an image to a user

```javascript
async addImage(data) {
  try {
    const response = await fetch('http://localhost:3020/users/addImage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      console.error('Server error:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}
```

### Get a user's images

```javascript
try {
  const response = await fetch('http://localhost:3020/users/images', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }), // Send JSON payload
  });
  if (response.ok) {
    const result = await response.json(); // Parse JSON response
    setItems(result); // Update state with fetched items
  } else {
    console.error('Server error:', response.statusText);
  }
} catch (error) {
  console.error('Network error:', error);


}
```

### The user object

```javascript
const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  images: {
    type: Array,
    required: false
  }
});
```

## Bugs and Issues

No bugs found as of now.
