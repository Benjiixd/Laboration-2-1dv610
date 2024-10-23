# Laboration-2-1dv610
Laboration 2, en modul


## Beskrivning

En modul, främst baserat på imageController.js och imageModel.js, som är skapad för att enklare kunna ladda upp, och använda bilder
från en databas.

## Installation

- clonea repot
- se till att en .env fil finns i yttersa mappen
- .env filen ska innehålla: DB_CONNECTION_STRING="mongodb://localhost:27017/ditt-namn-här"
- kör npm i
- kör npm run start/ npm run dev


- gör en post/get/delete request till localhost:2020, gärna med tex postman

## Request guides:

- Post:
    post till /
    inkludera en fil, med namn "file"
    postea

- Get:
    get till /:id
    byt ut ":id" till id't du vill få
    skicka request

- delete
    delete till /:id
    byt ut ":id" till id't du vill ta bort
    skicka request





# imageController:

### importing:

```javascript
import { ImageController } from '../imageSaver/imageController.js'
import { imageModel } from '../imageSaver/imageModel.js'

```

### creating a controller object:
Note: a moongoose object needs to have been connected already before use

made so that you easily can make suer your app is correctly set before use
```javascript
const controller = new ImageController(ImageModel)
const app = controller.initializeApp() // initiziates a express app to use
```

### Upload a image to the database:

```javascript
const file = req.body.file //aslong as its a file it will work
const data = controller.saveImage(file)
console.log(data) //the new saved object
```

### get a image from the database:

```javascript
const fileId = req.params.fileId
const data = controller.getImage(fileId)
res.setHeader('metadata', JSON.stringify(data.metadata)) // sets a header with the metadata
data.image.pipe(res)// sends the image to the client

// or if you want to use the imageFile again

const image = data.image

```
### Delete a image from the database:

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

### Update a image in the database:

```javascript
const file = req.body.file
const fileId = req.params.fileId
const data = controller.updateImage(fileId, file) // data becomes the new updated object stored in the database
console.log(data)
```

### The image object:
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
  }
        // Also the object contains a _id which is the object id, also the thing you search for in all of the method calls
})
```

# Bugs and issues

## Bug:

### The updateImage method doesnt work.

### Steps to recreate (in the test app)

- Start the app
- upload a image to the database
- try to update the image by providing a new one
- the application should crash

### Reason for the issue:
When the image gets updated, it deletes the old image files, and created new ones, but they change fileId in that case, which ends up not allowing it to find the image again

# License
MIT License

Copyright (c) 2024 Benjiixd

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
