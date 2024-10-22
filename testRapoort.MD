# TestRapport

Skriven av Benjamin Karlsson

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
    <td>En inloggad användare ska kunna ladda upp en bild, och se den</td>
    <td>K</td>
    <td>N/A</td>
    <td></td>
    <td>TC 3.1-4.2</td>
  </tr>
  <tr>
    <td>Enbart bilder ska kunna laddas&nbsp;&nbsp;upp</td>
    <td>Ö</td>
    <td>3</td>
    <td></td>
    <td>TC 5.2</td>
  </tr>
  <tr>
    <td>En användare ska kunna se sina bilder</td>
    <td>K</td>
    <td>N/A</td>
    <td></td>
    <td>TC 6.1-TC6.2</td>
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

## TC1.1 Let a user create a account
prerequsies: the frontend and backend apps must be running on the correct ports

steps:
- User navigates to /account
- User presses the create button
- User enters a username and password

expected outcome:

The user should be redirected to /account but with the login button

## TC1.2 Dont let a user create fulty a account

prerequsies: the frontend and backend apps must be running on the correct ports

steps:

- User navigates to /account
- User presses the create button
- User enters a username and password
- user presses create

expected outcome:

The user should be told to enter correct values

## TC1.2 Let a user create a account

prerequsies: the frontend and backend apps must be running on the correct ports

steps:

- User navigates to /account
- User presses the create button
- User enters a faulty username and faulty password
- user presses create

expected outcome:

The user should be redirected to /account but with the login button


## TC2.1: Upload a image, and have it stored in a DB

prerequsies: The module must be used in some sort of an app, like this test-app
and the TC1.1 must have succeeded.

steps:

- After TC1.1 enter the username and password for the created account
- Press sign in

expected outcome:

- The user should be redirected to the home page, with their name in the top right corner

## TC1.2 Try to store a non-file to the DB

prerequsies: The module must be used in some sort of an app, like this test-app

steps:

- Do a post request to the root of the localhost
- The post request should have a string, named file in the body
- post

expected outcome:

- The response should be an error that something went wrong

## TC2.1 Get a image from the DB

prerequsies: The upload functionality must work

steps:

- Upload a file successfully
- Copy the fileId that is returned
- do a get request, to localhost:2020/fileId (change fileId to the actual id)

expected outcome:

- A image file, with a header for metadata

## TC2.2 try to get a non-existing image from the db

prerequsies: none

steps:

- do a get request, to localhost:2020/23142142413

expected outcome:

- An error saying it doesnt exist

## TC3.1 delete a image from the db

prerequsies:

- the upload file functionality must work

steps:

- Upload a file successfully
- Copy the fileId that is returned
- do a delete request, to localhost:2020/fileId (change fileId to the actual id)
- do a get request, to localhost:2020/fileId (change fileId to the actual id)

expected outcome:

- The same result as in TC2.2

## TC3.2 delete a non existing image from the db

prerequsies:

steps:

- do a delete request, to localhost:2020/23142142413

expected outcome:

- An error message should be responded with

## TC4.1 edit a existing image in the db

prerequsies: The upload file functionalty, and get file functionality must work

steps:

- Do a post request to the root of the localhost
- The post request should have a image file, named file in the body
- post
- Do a post request to the localhost/edit
- The post request should have a image file, named file in the body and a fileId in the body
- The server should respond with sucess and the fileId
- follow TC2.1

expected outcome:

- The image should have changed to the new one from the change request

## TC4.2 edit a non-existing image from the db

prerequsies:

steps:

- Do a post request to the localhost/edit
- The post request should have a image file, named file in the body and a fileId in the body
- the fileId should be something random, like 2654621321

expected outcome:

- The server should say no file like that exists
