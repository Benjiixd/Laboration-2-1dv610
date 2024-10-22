# Laboration-3-1dv610

Laboration 3, en app

## Beskrivning

Detta är en app som är gjord för att kunna ha en digital klädkammare, gjord för folk som mig, som på grund av sin sambo måste ha alla sina kläder i tryckta i en låda...

## Installation

- clonea repot
- öppna upp två terminaler inom repot
- byt ena terminalen till /frontend och andra till /imagesaver
- kör npm i i bägge terminalerna
- i /imagesaver, kör npm run start
- i frontend, kör npm run build, följt av npm run start
- se till

## backend endpoints

### imageSaver

- Post:
    post till /images
    inkludera en fil, med namn "file"
    postea

- Get:
    get till /images/:id
    byt ut ":id" till id't du vill få
    skicka request

- Delete:
 delete till /images/:id till id't för att ta bort det.

- Post:
post till /images/changeIsDirty med id't i body'n.

### userSaver

- post: post till /users/images ger en användares bilder

- post: post till /users/create med ett "username" och ett "password" skapar ett nytt konto

- post: post till /users/login med ett "username" och ett "password" loggar in en användare genom att svara med en JWT

- post: post till /users/verify verifierar en JWT

- post: post till /users/addimage med "username" och "imageid" i body'n, lägger till en bild till en avändare.

## Frontend

The frontend consists of a nextJS project using react. The frontend barely does anything other than display buttons and such, and lets the backend take care of all the validation of requests and such.

The one time the frontend application takes care of something important is verifying a jwt, this is done in the middleware.js file:

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

Aswell as in the tokenReader.js, that makes it easier to get a username from a token:

``` javascript
export function useNameFromToken(token) {
  try {
                const parsedAuthStatus = JSON.parse(token); // Parse the JSON string
                if (parsedAuthStatus && parsedAuthStatus.username) {
                    const username = parsedAuthStatus.username;
                    return username
                }
            } catch (error) {
                console.error('Error parsing auth-status cookie:', error);
            }

}
```

Other than that, the frontend really is just, a frontend.

## Backend

The backend consists of two different "apps" of their own, these are located in the folders ImageSaver, and UserSaver.

The ImageSaver is from the previous assigment and is still the module, with a couple of tweaks since last time.

The UserSaver is a endpoint that is mainly handles Users, by creating, authenticating and changing users.

## ImageSaver

### importing

```javascript
import { ImageController } from '../imageSaver/imageController.js'
import { imageModel } from '../imageSaver/imageModel.js'

```

### creating a controller object

Note: a moongoose object needs to have been connected already before use

made so that you easily can make sure your app is correctly set before use

```javascript
const controller = new ImageController(ImageModel)
const app = controller.initializeApp() // initiziates a express app to use
```

### Upload a image to the database

```javascript
const file = req.body.file //aslong as its a file it will work
const metadata = {
    req.body.title
    req.body.description
    owner: req.body.owner,
    isDirty: false
}
const data = controller.saveImage(file, metadata)
console.log(data) //the new saved object
```

### get a image from the database

```javascript
const fileId = req.params.fileId
const data = controller.getImage(fileId)
res.setHeader('metadata', JSON.stringify(data.metadata)) // sets a header with the metadata
data.image.pipe(res)// sends the image to the client

// or if you want to use the imageFile again

const image = data.image

```

### Delete a image from the database

```javascript
const fileId = req.params.fileId
const data = controller.deleteImage(fileId)
console.log(data) //if successfull data = 1
if (data == 1){
    console.log("sucess")
}
else{
    console.log("error")
}
```

### Update isDirty

```javascript
const fileId = req.body.id
const result = await this.saver.changeIsDirty(fileId)
if (result === 1) {
    return res.status(200).send('Image updated successfully')
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
  fileId: { // The fileId thats connected to gridFS
    type: String,
    required: false
  },
  mimetype: { // In other words the imageType
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  size: { // the size in bytes
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
        // Also the object contains a _id which is the object id, also the thing you search for in all of the method calls
})
```

## UserSaver

Since the userSaver is never called by anything other than a api call, the fetches will be shown:

### Create a new user

```javascript
        const onCreate = async (data) => {
        try {
            const response = await fetch('http://localhost:3020/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = response.status
            if (result === 200) {
                window.location.reload() // On success, reload the window to go to login
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

```

### Login a user

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
            Cookies.set('token', responseData.token); // Set the token as a cookie
            router.push('/'); // Go to the homepage
            setLoginFailed(false); // Set a hook to false
        } catch (error) {
            setLoginFailed(true);
        }
    };
```

### Add a image to a user

```javascript
        async addImage(data) {
        try {
            const response = await fetch("http://localhost:3020/users/addImage", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const result = await response.json();
                return result;
            } else {
                console.error("Server error:", response.statusText);
                return null;
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    }
```

### Get the images of a user

```javascript
        try {
      const response = await fetch("http://localhost:3020/users/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Setting the correct content type for JSON
        },
        body: JSON.stringify({ username }), // Send JSON payload
      });
      if (response.ok) {
        const result = await response.json(); // Parse JSON response
        setItems(result); // Update state with fetched items
      } else {
        console.error("Server error:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
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
})
```

## Bugs and issues

No bugs found as of this.
