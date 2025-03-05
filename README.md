# Work Order Manufacturing

Welcome to the **Work Order Manufacturing** project! This project consists of a **Backend** and **Frontend**, designed to manage the manufacturing work process through a web-based system.

## Prerequisites

Before running this project, make sure you have installed:

- **Node.js** (version >= 18)
- **PostgreSQL**

---

## 🚀 Running the Backend

### 1️⃣ Navigate to the backend directory

```sh
cd server
```

### 2️⃣ Create an environment configuration file

```sh
touch .env
```

Copy and paste the required environment variables into the `.env` file.

### 3️⃣ Install dependencies

```sh
npm install
```

### 4️⃣ Set up the database

For the first-time setup, create and migrate the database using the following commands:

```sh
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```

### 5️⃣ Adding Users (Optional)

Currently, users can only be added via the CLI. Use the following commands to add an **operator** or **product manager**:

```sh
USER_NAME={username} USER_PASSWORD={password} npx sequelize-cli db:seed --seed 20250301042259-create_operator.js
```

```sh
USER_NAME={username} USER_PASSWORD={password} npx sequelize-cli db:seed --seed 20250301042306-create_product_manager.js
```

### 6️⃣ Build and Start the Backend

```sh
npm run build
npm start
```

### 7️⃣ Access API Documentation (Swagger)

Once the server is running, you can access the API documentation at:

```
http://localhost:{port}/docs
```

---

## 🎨 Running the Frontend

### 1️⃣ Navigate to the frontend directory

```sh
cd client
```

### 2️⃣ Create an environment configuration file

```sh
touch .env
```

Copy and paste the required environment variables into the `.env` file.

### 3️⃣ Install dependencies

```sh
npm install
```

### 4️⃣ Build and Start the Frontend

```sh
npm run build
npm start
```

---

## 🎯 Conclusion

By following the steps above, the **Work Order Manufacturing** project should be up and running successfully in your environment. If you encounter any issues, please double-check the configuration or contact the development team.

🚀 Happy coding and good luck!

### Note

By Default Frontend port is **3000** and Backend port is **3001**
