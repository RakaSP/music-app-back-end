# Music RESTful API

The **Music RESTful API** is a robust backend service designed to efficiently manage music data. It offers a range of dynamic features, including the ability to search for songs, create and manage playlists, and upload albums and individual tracks. With a focus on user security, the API includes advanced authentication and authorization mechanisms for personalized access. Users can collaborate on playlists and easily export them via email, facilitating the curation and distribution of their music collections. This API is an essential tool for developers looking to integrate music management functionalities into their applications.

## Showcase Images

### 1. API Design Flow

![API Flow](https://github.com/user-attachments/assets/2fed0239-26de-454d-a055-b935c6fea7c3)
_This diagram illustrates the design flow of the Music RESTful API. It showcases how different components interact with each other, including the database, authentication services, and client requests. Understanding this flow is crucial for grasping the API's functionality and scalability._

### 2. Postman Testing on Various Scenarios

![Postman Testing](https://github.com/user-attachments/assets/ef348e0b-1982-4991-86a8-a912608bbe66)
_This screenshot from Postman demonstrates testing various API endpoints, including creating playlists, uploading albums, and searching for tracks. Each request and response showcases the API's dynamic capabilities and highlights its reliability in handling different scenarios._

### 3. PGAdmin to Showcase Schema Relation

![Database Schema](https://github.com/user-attachments/assets/53d53c7e-0258-406d-8069-c9e0f310d5e6)
_This image presents the database schema using PGAdmin, illustrating the relationships between different entities within the Music RESTful API. It provides insight into how data is organized, helping users understand the backend structure that supports efficient data management and retrieval._

### 4. Exporting a Playlist into JSON File and Sending it to User's Email Using RabbitMQ

![Exporting Playlist](https://github.com/user-attachments/assets/acdb77dc-0b43-411d-b93a-c467b116b139)
_This image captures the functionality of exporting a user's playlist into a JSON file and sending it to their email. It highlights the integration of RabbitMQ for asynchronous email processing, ensuring a seamless user experience when sharing curated music collections._

## Getting Started

Follow these steps to set up the Music RESTful API and its consumer.

### 1. Environment Configuration

#### 1.1. Create the `.env` File for the API

Inside the `open-music-api-v3` folder, create a file named `.env` and add the following configurations:

```
HOST=
PORT=

PGUSER=
PGHOST=
PGPASSWORD=
PGDATABASE=
PGPORT=

ACCESS_TOKEN_KEY=
REFRESH_TOKEN_KEY=
ACCESS_TOKEN_AGE=1800

RABBITMQ_SERVER=amqp://localhost

REDIS_SERVER='127.0.0.1'
```

**For `ACCESS_TOKEN_KEY` and `REFRESH_TOKEN_KEY`:**

Run the following command twice to generate secure tokens:

```bash
node -p "require('crypto').randomBytes(64).toString('hex')"
```

- Copy the first output for `ACCESS_TOKEN_KEY`.
- Copy the second output for `REFRESH_TOKEN_KEY`.

#### 1.2. Create the `.env` File for the Consumer

Inside the `open-music-api-v3-consumer` folder, create a file named `.env` and add the following configurations:

```
PGUSER=
PGHOST=
PGPASSWORD=
PGDATABASE=
PGPORT=

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sender_email
SMTP_PASSWORD=

RABBITMQ_SERVER=amqp://localhost
```

### 2. Database Setup

- Create the database using your preferred PostgreSQL client or command line.

### 3. Run Migrations

Navigate to the `open-music-api-v3` folder and execute the following command to run the database migrations:

```bash
npm run migrate:up
```

### 4. Start the API Server

Still in the `open-music-api-v3` folder, run the following command to start the development server:

```bash
npm run start:dev
```

### 5. Start the Consumer

Open a new terminal window, navigate to the `open-music-api-v3-consumer` folder, and run the following command to start the consumer:

```bash
node ./src/consumer.js
```

---

Follow these steps to get your Music RESTful API and its consumer up and running. If you encounter any issues, feel free to check the documentation or reach out for support.

### 6. Test the API Using Postman

Import the Postman test collection and environment located inside the `open-music-api-v3/test` folder into Postman.

---

Follow these steps to get your Music RESTful API and its consumer up and running.
