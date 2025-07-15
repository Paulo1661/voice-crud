# Demo Voice Control App

This is a demo project for a Spring Boot application that demonstrates voice control capabilities for CRUD operations. It uses a combination of Java, Spring Boot, and modern front-end technologies to provide a seamless user experience.

## Features

*   **Voice Control:** Perform CRUD operations using voice commands.
*   **Transaction Management:** A simple interface to manage transactions.
*   **Spring Boot Backend:** A robust and scalable backend powered by Spring Boot.
*   **Modern Frontend:** A responsive and interactive user interface built with `htmx`, `Alpine.js`, and `Tailwind CSS`.
*   **In-Memory Database:** Utilizes an H2 in-memory database for ease of use and setup.
*   **OpenAI Integration:** Leverages OpenAI's models for voice recognition and processing.

## Getting Started

### Prerequisites

*   Java 21 or higher
*   Maven 3.6 or higher
*   Node.js and npm (optional, for front-end development)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/demo-voice-control-app.git
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd demo-voice-control-app
    ```

3.  **Build the project:**

    ```bash
    ./mvnw clean install
    ```

4.  **Run the application:**

    ```bash
    java -jar target/voice-crud-0.0.1-SNAPSHOT.jar
    ```

## Usage

Once the application is running, you can access it in your web browser at `http://localhost:8080`.

The main page will display a list of transactions. You can use the voice control button to issue commands to add, update, or delete transactions.

### H2 Console

You can access the H2 database console at `http://localhost:8080/h2-console`.

Use the following settings to connect:

*   **Driver Class:** `org.h2.Driver`
*   **JDBC URL:** `jdbc:h2:mem:testdb`
*   **User Name:** `sa`
*   **Password:** (leave blank)

## Configuration

The application can be configured through the `src/main/resources/application.properties` file.

### OpenAI API Key

To use the voice control features, you need to provide an OpenAI API key. You can do this by creating a `.env` file in the root of the project with the following content:

```
OPEN_AI_KEY=your-api-key
```

Alternatively, you can set the `SPRING_AI_OPENAI_API_KEY` environment variable.

## Voice Control

The voice control functionality is handled by the `src/main/resources/static/js/script.js` file. This file contains the logic for establishing a WebRTC connection with the OpenAI API and defining the voice commands that can be used to interact with the application.

### WebRTC Connection with OpenAI

The `initializeWebRTC` function is responsible for setting up the WebRTC connection. It performs the following steps:

1.  **Gets an ephemeral token:** It fetches a temporary token from the server to authenticate with the OpenAI API.
2.  **Creates a peer connection:** It creates a new `RTCPeerConnection` object to handle the WebRTC session.
3.  **Sets up audio playback:** It configures an audio element to play the audio received from the OpenAI API.
4.  **Adds local audio track:** It captures the user's microphone input and adds it to the peer connection.
5.  **Creates a data channel:** It creates a data channel to send and receive messages from the OpenAI API.
6.  **Creates and sends an offer:** It creates an SDP offer and sends it to the OpenAI API to initiate the connection.
7.  **Sets the remote description:** It receives an SDP answer from the OpenAI API and sets it as the remote description.

### Voice Control Tools

The `configureTools` function defines the voice commands that can be used to interact with the application. These commands are sent to the OpenAI API as a list of tools that the model can use.

The following voice commands are available:

*   **`changeBackgroundColor(color)`:** Changes the background color of the webpage.
*   **`searchByDescriptionOrCategory(keyword)`:** Searches for transactions by description or category.
*   **`displayTransactionsList()`:** Displays the list of all transactions.
*   **`deleteATransaction(id)`:** Deletes a transaction with the specified ID.
*   **`addATransaction(amount, date, category, description)`:** Adds a new transaction.
