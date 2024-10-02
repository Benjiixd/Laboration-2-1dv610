# Laboration-2-1dv610
Laboration 2, en modul


# Beskrivning

En modul, främst baserat på imageController.js och imageModel.js, som är skapad för att enklare kunna ladda upp, och använda bilder
från en databas.

# Installation

- clonea repot
- se till att en .env fil finns i yttersa mappen
- .env filen ska innehålla: DB_CONNECTION_STRING="mongodb://localhost:27017/ditt-namn-här"
- kör npm i
- kör npm run start/ npm run dev


- gör en post/get/delete request till localhost:2020, gärna med tex postman

# Request guides:

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


