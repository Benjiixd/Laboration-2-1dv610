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

## Test specification

### TC1.1 Let a user create a account
prerequsies: the frontend and backend apps must be running on the correct ports

steps:
- User navigates to /account
- User presses the create button
- User enters a username and password

expected outcome:

The user should be redirected to /account but with the login button

### TC1.2 Dont let a user create fulty a account

prerequsies: the frontend and backend apps must be running on the correct ports

steps:

- User navigates to /account
- User presses the create button
- User enters a username and password
- user presses create

expected outcome:

The user should be told to enter correct values

### TC2.1 Let a user login to a account

prerequsies: the frontend and backend apps must be running on the correct ports
and the TC1.1 must have succeeded.

steps:

- After TC1.1 enter the username and password for the created account
- Press sign in

expected outcome:

- The user should be redirected to the home page, with their name in the top right corner

### TC2.2 Dont let a user login to a account without correct initials

prerequsies: the frontend and backend apps must be running on the correct ports

steps:

- User navigates to /account
- User enters a username and password that isnt correct
- user presses sign in

expected outcome:

- The user should be redirected to the account page, with a text telling them something is wrong



### TC3.1 Allow a user to upload a image
prerequsies: the frontend and backend apps must be running on the correct ports
and TC1.1 and TC2.1 must pass

steps:

- user navigates to /upload
- user adds a title and description
- user adds a image
- user presses upload

expected outcome:

- The user will be redirected to the home page

### TC3.2 Only allow a user to upload images

prerequsies: the frontend and backend apps must be running on the correct ports
and TC1.1 and TC2.1 must pass

steps:

- user navigates to /upload
- user adds a title and description
- user adds a video
- user presses upload

expected outcome:

- The user will be told to upload a image not a video

### TC4.1 Allow a user to see their images

prerequsies: the frontend and backend apps must be running on the correct ports
and TC1.1, TC2.1  and TC3.1 must pass

Steps:

- user logs in
- user navigates to /

expected outcome:

- The user will see their images


### TC4.2 Dont show images if a user isnt logged in

prerequsies: the frontend and backend apps must be running on the correct ports


Steps:

- user navigates to /

expected outcome:

- The user will not see any images

### TC5.1 Allow a user change status of their images

prerequsies: the frontend and backend apps must be running on the correct ports
and TC1.1, TC2.1, TC3.1 and TC4.1 must pass

Steps:

- user logs in
- user navigates to /
- user presses the button that says dirty or clean
- user refreshes page

expected outcome:

- The status should be changed and saved

## Automated test

After starting both apps accourding to the README
In the tester folder, write npm i
then write npm run test

A test and result will be shown



## Results:

### Kravspecifikation

### Test cases

### Automated test


