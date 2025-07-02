# ซอร์สโค้ดนี้ ใช้สำหรับเป็นตัวอย่างเท่านั้น ถ้านำไปใช้งานจริง ผู้ใช้ต้องจัดการเรื่องความปลอดภัย และ ประสิทธิภาพด้วยตัวเอง

# การใช้งาน Demo
- ไปที่ web app, คลิก ดูแผนผังบูธ (บนขวา) 
- demo เป็น admin, กรอกข้อมูลการจัดตลาดนัด
- ข้อมูลการจัดงาน จะแสดงที่ด้านล่าง
- demo เป็นผู้เช่า, ไปที่ แผนผังบูธ
- เลือกบูธที่ว่าง (สีเขียว) คลิก จองบูธนี้
- กรอกข้อมูล คลิก ยืนยันการจอง
- เมื่อ popup QR Code ขึ้นมา ให้คลิก ปิด
- ข้อมูลจะถูกส่งไปยัง server
- ข้อมูลจะถูกส่งต่อไปยัง n8n
- n8n จะส่ง ข้อความยืนยัน การรับเงิน ไปยัง Telegram ตาม Chat ID ที่กรอกไว้ในข้อมูลการจอง
- ในทุกวัน เมื่อถึงเวลาที่ตั้งค่าไว้ server จะดึงข้อมูล จากฐานข้อมูล เฉพาะข้อมูล ที่ต้องการแจ้งเตือน ผู้เช่า ว่าใกล้ถึงเวลาจัดงานแล้ว
- ข้อมูลจะถูกส่งต่อไปยัง n8n
- n8n จะส่ง ข้อความแจ้งเตือน ไปยังผู้เช่า ทาง Telegram

---

# MarketSync Project

This project consists of a backend server (Node.js/Express) and a frontend application (React/Vite) designed for booth booking and management. It integrates with an n8n webhook for data forwarding and scheduled tasks.

## Features

### Backend
*   **Booth Booking Submission:** Handles incoming booking requests from the frontend.
*   **Local Data Persistence:** Stores all booking data in a local `db.json` file.
*   **n8n Webhook Integration:** Forwards new booking submissions to a configured n8n webhook.
*   **Scheduled Daily Exports:** A cron job runs daily to fetch and send reminder bookings to the n8n webhook.

### Frontend
*   **React Application:** Built using React and Vite for a fast development experience.
*   **Routing:** Utilizes `react-router-dom` for navigation, including a home page (`/`) and a booth layout page (`/booth-layout`).
*   **State Management:** Employs `@tanstack/react-query` for efficient data fetching, caching, and synchronization.
*   **Styling & UI:** Styled with Tailwind CSS and uses `shadcn/ui` components for a modern and responsive user interface.

## Technologies Used

### Backend
*   **Node.js:** JavaScript runtime environment.
*   **Express.js:** Web application framework for Node.js.
*   **Axios:** Promise-based HTTP client for making requests.
*   **Node-cron:** A library for scheduling tasks in Node.js.
*   **fs (File System):** Node.js built-in module for interacting with the file system.

### Frontend
*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A superset of JavaScript that adds static typing.
*   **Vite:** A fast build tool that provides a lightning-fast development experience.
*   **React Router DOM:** Declarative routing for React.
*   **@tanstack/react-query:** Powerful asynchronous state management library.
*   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
*   **shadcn/ui:** Reusable components built with Radix UI and Tailwind CSS.

## Setup Instructions

### Prerequisites
Ensure you have Node.js installed on your system. You can use npm, yarn, or bun as your package manager.
TODO 30
### Backend Setup

```bash
https://github.com/warathepj/n8n-MarketSync-backend.git
```
1.  **Navigate to the backend directory:**
    ```bash
    cd n8n-MarketSync-backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    # or bun install
    ```
3.  **Start the backend server:**
    ```bash
    node server.js
    # or if a start script exists in package.json:
    # npm start
    ```
    The backend server will run on `http://localhost:3001`.

### Frontend Setup

```bash
https://github.com/warathepj/c6f6700c-0ed6-4735-8827-b36faac76785.git
```

1.  **Navigate to the frontend directory:**
    ```bash
    cd c6f6700c-0ed6-4735-8827-b36faac76785/
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    # or bun install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    # or bun dev
    ```
    The frontend application will typically run on `http://localhost:5173` (or another available port).

### n8n Webhook Integration
This project relies on an n8n instance to receive booking data.
The webhook URL configured in `backend/server.js` is:
`http://localhost:5678/webhook/your-webhook-id`

Ensure your n8n workflow is set up to listen for `POST` requests at this URL. It will receive:
*   New booking submissions from the `/submit-booking` endpoint.
*   Daily scheduled booking data from the cron job.

## API Endpoints
TODO 2
### `POST /submit-booking`
*   **Description:** Submits new booth booking information to the backend.
*   **Request Body (JSON):**
    ```json
    {
      "boothId": "string",
      "name": "string",
      "contact": "string",
      "boothType": "string",
      "eventDetails": {
        "startDate": "ISOString",
        "endDate": "ISOString",
        "eventName": "string",
        "location": "string"
      }
    }
    ```
*   **Webhook Payload:** The same JSON payload received by this endpoint is forwarded to the n8n webhook.

## Scheduled Tasks

A cron job is configured in `backend/server.js` to run daily at **16:00 (4:00 PM) Asia/Bangkok timezone**.
This job performs the following actions:
1.  Fetches all bookings from `db.json` that have a `timestamp` matching the current UTC date.
2.  Creates a modified copy of these bookings, incrementing `eventDetails.startDate` and `eventDetails.endDate` by one day.
3.  Sends this modified list of today's bookings to the n8n webhook with an additional `source: 'cron_job'` field in the payload.

## Data Storage

All booking data is stored locally in `db.json` in the `backend/` directory. This file is automatically created and updated by the backend server.

---
TODO 2
# MarketSync n8n Workflow

MarketSync is an n8n workflow designed to automate notifications for market stall bookings and payments via Telegram. This workflow streamlines communication with vendors, providing timely updates on their bookings and payment confirmations.

---

## Features

* **Booking Confirmation:** Automatically sends a Telegram message to vendors upon successful booth booking, including details like booth ID, type, market dates, times, and location.
* **Payment Confirmation:** Notifies vendors via Telegram once their payment for a booked stall is received, reiterating market details for clarity.
* **Conditional Logic:** Uses an "If" node to differentiate between booking and payment notifications based on the incoming webhook data.
* **Data Splitting:** Utilizes a "Split Out" node to process multiple bookings if they are received within a single webhook payload.

---

## How It Works

The MarketSync workflow is triggered by an **HTTP Webhook**. Here's a step-by-step breakdown:

1.  **Webhook Trigger:** The workflow starts when an HTTP POST request is received at the specified webhook URL (`your_webhook_url`). This webhook is expected to receive JSON data containing booking or payment information.
2.  **Conditional Check (If Node):**
    * The "If" node checks for the existence of `{{ $json.body.source }}` in the incoming data.
    * If `source` exists (indicating a payment confirmation), the workflow proceeds to the "Telegram1" node.
    * If `source` does not exist (indicating a new booking), the workflow proceeds to the "Split Out" node.
3.  **Split Out (for Bookings):**
    * The "Split Out" node is used when the webhook payload contains an array of bookings under `body.bookings`. It processes each booking individually, allowing separate Telegram messages to be sent for each.
4.  **Telegram Notifications:**
    * **"Telegram" node (for Bookings):** Sends a booking confirmation message to the vendor. The message includes:
        * Vendor's name (`{{ $json.name }}`)
        * Booked booth ID (`{{ $json.boothId }}`) and type (`{{ $json.boothType }}`)
        * Market dates (`{{ $json.eventDetails.startDate.split('T')[0] }}` to `{{ $json.eventDetails.endDate.split('T')[0] }}`)
        * Market times (`{{ $json.eventDetails.startTime }}` - `{{ $json.eventDetails.endTime }}`)
        * Market location (`{{ $json.eventDetails.location }}`)
        * The `chatId` for the Telegram message is dynamically pulled from `{{ $json.contact }}`.
    * **"Telegram1" node (for Payments):** Sends a payment confirmation message to the vendor. The message includes:
        * Vendor's name (`{{ $json.body.name }}`)
        * Booked booth ID (`{{ $json.body.boothId }}`)
        * Market dates (`{{ $json.body.eventDetails.startDate.split('T')[0] }}` to `{{ $json.body.eventDetails.endDate.split('T')[0] }}`)
        * Market times (`{{ $json.body.eventDetails.startTime }}` - `{{ $json.body.eventDetails.endTime }}`)
        * Market location (`{{ $json.body.eventDetails.location }}`)
        * The `chatId` for the Telegram message is dynamically pulled from `{{ $json.body.contact }}`.

---

## Setup

To use this n8n workflow, you will need:

1.  **n8n Instance:** A running instance of n8n.
2.  **Telegram Bot Token:** A Telegram bot set up and its API token configured as a credential in n8n (named "Telegram account").
3.  **Webhook Integration:** An external system that sends JSON data to the n8n webhook URL.

### Webhook Payload Examples:

**For a New Booking (triggering "Telegram" node):**

```json
{
  "name": "John Doe",
  "contact": "YOUR_TELEGRAM_CHAT_ID",
  "boothId": "A123",
  "boothType": "Food Stall",
  "eventDetails": {
    "startDate": "2025-07-15T00:00:00.000Z",
    "endDate": "2025-07-16T00:00:00.000Z",
    "startTime": "09:00",
    "endTime": "17:00",
    "location": "Central Market Square"
  }
}
