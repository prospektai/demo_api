# Demo API Documentation

## Request/response format

All requests to the API are sent in *JSON* format, except for JWT renew requests. All requests are sent over the HTTP(s) protocol

## Expected response format

Expected example responses from the API for a specific request are denoted as follows:

`200 || Service reachable`

`200` - HTTP response code

`||` - Visual seperator

`Service reachable` - Expected text response

---

## Route documentation

### **0. Utility routes**

- `GET /` - Check if the API is up

    *Expected response:* `200 || Service reachable`

---

### **1. Authentication routes**

- `POST /auth/register` - Register a new user

    *Required parameters (with respective naming):*

    ```json
    {
        "name": "example_name",
        "surname": "example_surname",
        "email": "example_email",
        "mobile": "example_phone",
        "password": "example_password"
    }
    ```

    *Expected response:* `200 || User [username] with email [email] has been registered`

- `POST /auth/login` - Login with credentials

    *Required parameters (with respective naming):*

    ```json
    {
        "email": "example_email",
        "password": "example_password"
    }
    ```

    *Expected response:* `200` You will receive a *token* cookie which you will have to provide when accessing **protected** routes.

    You must renew this token at most every 14min 30s and at least 14min 59s by calling `/auth/renew`, otherwise the client will have to login again

---

### **2. Authorisation routes**

- `POST /auth/renew` - Get a new JSON Web Token (only when an old JWT is provided)

    *Required parameters:* You must provide the old JWT in the `Cookie:` header when making this request

    ```http
    Cookie: token={JWT_token_goes_here}
    ```

    *Expected response:* `200` You will receive a **new** *token* cookie which you will have to provide when accessing **protected** routes

    You must renew this token at most every 14min 30s and at least 14min 59s by calling `/auth/renew`, otherwise the client will have to login again

---

### **3. Vehicle routes (protected)**

- `POST /vehicles/create` - Create a new vehicle entry in the database

    *Required parameters (with respective naming):*

    You must provide your JSON Web Token in the `Cookie:` header

    ```json
    {
        "stock_code": 1234,
        "make": "example_make",
        "model": "example_model",
        "year": 1234,
        "notes": "Any additional information is considered a note",
    }
    ```

    *Expected response:* `200 || <uid_here>`

- `POST /vehicles/upload` - Upload images to a specific vehicle folder, based on it's UID

    *Required parameters (with respective naming):*

    You must provide your JSON Web Token in the `Cookie:` header
    This request must have the `multipart/form-data` <i>enctype</i>

    ```js
            uid = "<uid_goes_here>"
            photos = [<photo_blob_1>, <photo_blob_2>, ..., max 35 photos]
        }
    ```

    *Expected response (with respective naming):* `200`

    ```json
        "<image_count> images uploaded successfully"
    ```

    **Note:** the total request size (including images) must not exceed 50 Mb

- `POST /vehicles/view` - Get information about a specific vehicle based on it's UID

    *Required parameters (with respective naming):*

    You must provide your JSON Web Token in the `Cookie:` header

    *Expected response (with respective naming):* `200`

    ```json
    [
        {
            "u_id": "RebyQ1Xho5TZ2MYqMRQF7v",
            "author_id": 1,
            "make": "example_make",
            "model": "example_model",
            "year": 1998,
            "image_path": "images/RebyQ1Xho5TZ2MYqMRQF7v/"
        }
    ]
    ```

    **Note:** more JSON objects wil be returned if the user has created multiple entries

    **Note:** after receiving the image path, the app must make a request and get all images in that directory. They are named 0.jpg, 1.jpg and so on, up to 35.jpg. These file requests are handled by nginx

---
