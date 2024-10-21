# Laboration-3-1dv610

Laboration 3, en app

## Beskrivning

Detta är en app som är gjord för att kunna ha en digital klädkammare, gjord för folk som mig, som på grund av sin sambo måste ha alla sina kläder i tryckta i en låda...

## Installation

- clonea repot
- se till att en .env fil finns i yttersa mappen
- .env filen ska innehålla: DB_CONNECTION_STRING="mongodb://localhost:27017/ditt-namn-här"
- kör npm i
- kör npm run start/ npm run dev

- gör en post/get/delete request till localhost:2020, gärna med tex postman

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

- changeIsDirty: 
post till /changeIsDirty med id't i body'n.

### userSaver

- post:
    

# Frontend

# Backend

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

# Bugs and issues


