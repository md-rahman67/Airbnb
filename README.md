# MyStay

MyStay is an Airbnb-inspired full-stack web application where users can explore property listings, create their own listings, upload images, and share reviews.

This project was built as a practice project to learn and understand full-stack web development using Node.js, Express.js, and MongoDB.

## Features

- **User Authentication:** Users can sign up, log in, and log out.
- **Listings Management:** Users can create, view, edit, and delete property listings.
- **Image Upload:** Users can upload listing images using Multer and Cloudinary.
- **Reviews and Ratings:** Users can add reviews and ratings to listings.
- **Authorization:** Only authorized users can edit or delete their own listings and reviews.
- **Input Validation:** Joi is used to validate listing and review data.
- **Flash Messages:** Displays success and error messages to users.
- **Responsive Design:** The application uses Bootstrap for a responsive and user-friendly interface.

## Tech Stack

**Frontend**
- HTML
- CSS
- Bootstrap
- EJS
- Font Awesome

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

**Authentication and Validation**
- Passport.js
- Passport Local
- Express Session
- Connect Flash
- Joi

**Image Upload**
- Multer
- Cloudinary

## Project Structure

- **models/** – Contains database models for users, listings, and reviews.
- **routes/** – Defines application routes for listings, users, and reviews.
- **controllers/** – Contains the logic for handling application requests.
- **views/** – Contains EJS templates used to display pages.
- **public/** – Stores static files such as CSS and client-side assets.
- **middleware.js** – Contains middleware for authentication and authorization.
- **schema.js** – Contains Joi validation schemas.
- **app.js** – Main application file that connects the different parts of the application.

## How It Works

The application follows a simple request-response flow:

1. A user interacts with the website through the browser.
2. Express receives the request and sends it to the appropriate route.
3. Middleware checks authentication, authorization, and validation when required.
4. Controllers handle the application logic.
5. Models communicate with MongoDB to store or retrieve data.
6. EJS renders the required page and sends the response to the user.

For image uploads, Multer handles the uploaded file and Cloudinary stores the image in the cloud.

## Purpose

The main purpose of this project is to practice full-stack web development and understand how different technologies work together to build a web application.

## Author

md-Rahman67