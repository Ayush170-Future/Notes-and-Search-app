# Containerized Notes and Search Backend Application

Libraries and their use-case:

- **bcrypt**: Securely hashes passwords to protect user data.
- **dotenv**: Manages environment variables for configuration separation.
- **express**: Provides a flexible framework for web application development.
- **express-async-handler**: Simplifies error handling for asynchronous code in Express.
- **express-rate-limit**: Prevents abuse by limiting incoming requests.
- **jsonwebtoken**: Generates and verifies secure JSON Web Tokens for authentication.
- **mongoose**: Simplifies MongoDB interactions with schema-based modeling.

## Tech Stack

**Server:** Node, Express, MongoDB, JWT

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`
`MONGODB_URI` (Setup MongoDB locally and use Compass)
`JWT_SECRET`

## Docker Containerization

This project has been containerized using Docker for easy deployment and reproducibility.

### Installation Steps

1. Install Docker Desktop: [Docker Desktop Installation Guide](https://www.docker.com/products/docker-desktop)

2. Pull the Docker image from my public repository:
    ```bash
    docker pull ayushsingh170/containerized-notes-and-search-backend
    ```

3. Run the Docker container:
    ```bash
    docker run -d -p 5000:5000 ayushsingh170/containerized-notes-and-search-backend
    ```

## Installation Steps (Without Docker)

1. Clone the repository:
    ```bash
    git clone git@github.com:Ayush170-Future/Notes-and-Search-app.git
    ```

2. Change into the project directory:
    ```bash
    cd Notes-and-Search-app
    ```

3. Switch to the master branch:
    ```bash
    git checkout master
    ```

4. Install dependencies:
    ```bash
    npm install
    ```

## Usage

- Run the backend:
    ```bash
    npm run dev
    ```

- Run unit tests:
    ```bash
    npm run test
    ```

## 🚀 About Me
Hey! This is Ayush Singh. I'm a backend developer and a Bitcoin core contributor from India. 

Most recently, I was chosen among 45 students from all over the world for the Summer of Bitcoin internship, where I was responsible for making open-source contributions to Bitcoin Core. I made 4 PRs to the original Bitcoin you must have heard about in the news, one of them is already merged and is in production. Along with that, I'm a backend developer who has worked on many full-stack applications related to Blockchain and Core CS technologies. I'm also a great problem solver as I do a lot of competitive programming, I'm a Specialist on Codeforces, an ICPC India regionalist, and a Knight on Leetcode.

Besides my technical knowledge and experience, I'm very interested in philosophy and I'm a self-driven person, I don't need external motivation to work hard, I'm a naturally hardworking being, who gets things done.
