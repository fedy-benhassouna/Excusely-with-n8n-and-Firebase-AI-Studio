
# Excusely: The AI-Powered Excuse Generator 

**Excusely** is a whimsical AI application that crafts humorous and absurd excuses on demand. Built using [Firebase AI Studio](https://firebase.google.com/products/ai-studio) for the front-end and [n8n](https://n8n.io/) for backend automation, this project seamlessly integrates AI-driven workflows to deliver entertaining excuses for any situation.

---

## 🚀 Features

* **AI-Generated Excuses**: Leverages AI to produce creative and unexpected excuses.
* **Seamless Integration**: Combines Firebase AI Studio's front-end capabilities with n8n's backend automation.
* **Webhook Communication**: Utilizes webhooks for real-time data exchange between the front-end and backend.
* **Customizable Workflows**: Easily modify workflows in n8n to tailor the excuse generation process.

---

## 🛠️ Technologies Used

* [Firebase AI Studio](https://firebase.google.com/products/ai-studio): For building the front-end interface.
* [n8n](https://n8n.io/): For orchestrating backend workflows and integrating AI services.
* [OpenAI API](https://openai.com/api/): To generate the content of the excuses.
* [GitHub](https://github.com/): Version control and collaboration.

---

## 📈 Workflow Diagram

![Workflow Diagram](https://github.com/user-attachments/assets/f18973de-c125-4b4d-a204-067ec6d2479d)

*Figure 1: Overview of the Excusely application's architecture in n8n .*

---

## 🎬 Demo

![Excusely Demo](https://github.com/user-attachments/assets/123c65da-26a0-491e-8f32-ba54f6fcc244)

*Figure 2: Demonstration of Excusely generating an excuse based on user input.*

---

## 📦 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/en/) installed
* [Firebase CLI](https://firebase.google.com/docs/cli) installed
* [n8n](https://n8n.io/) installed and configured

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/fedy-benhassouna/Excusely-with-n8n-and-Firebase-AI-Studio.git
   cd Excusely-with-n8n-and-Firebase-AI-Studio
   ```

2. **Set up Firebase AI Studio:**

   * Navigate to the `firebase-ai-studio` directory.

   * Install dependencies:

     ```bash
     npm install
     ```

   * Start the development server:

     ```bash
     npm start
     ```

3. **Configure n8n:**

   * Import the `excuse-generator.json` workflow into your n8n instance.
   * Ensure that the webhook URL matches the endpoint expected by the Firebase front-end.
   * Set up necessary credentials for the OpenAI API within n8n.

---

## 🧪 Usage

1. Open the Firebase AI Studio application in your browser.
2. Enter a context or situation for which you need an excuse.
3. Submit the input and receive a uniquely generated excuse.

---

## 🙌 Acknowledgements

* Inspired by the need for lightheartedness and humor in daily interactions.
* Thanks to the developers of Firebase AI Studio and n8n for providing powerful tools for rapid application development.
