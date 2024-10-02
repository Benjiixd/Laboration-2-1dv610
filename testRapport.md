# Testning:


## TC1.1: Upload a image, and have it stored in a DB

prerequsies: The module must be used in some sort of an app, like this test-app

steps: 
- Do a post request to the root of the localhost
- The post request should have a image file, named file in the body
- post

expected outcome:
- The response should be that a image has been saved to the db, with a fileId




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
-  The same result as in TC2.2


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
-   The image should have changed to the new one from the change request

## TC4.2 edit a non-existing image from the db

prerequsies:

steps:
- Do a post request to the localhost/edit
- The post request should have a image file, named file in the body and a fileId in the body
- the fileId should be something random, like 2654621321


expected outcome:
- The server should say no file like that exists



|          | .1 | .2 |
|----------|----|----|
| TC.1     |    |    |
| TC.2     |    |    |
| TC.3     |    |    |
| TC.4     |    |    |
| Coverage |    |    |