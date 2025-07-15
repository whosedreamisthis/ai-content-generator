# AI Content Generator

This application is a versatile AI-powered content generation tool that allows users to select from various pre-defined templates and generate content based on their input. It leverages a modern web stack to provide a smooth and responsive user experience.

---

## Features

* **Template Browse:** Easily browse through a collection of content generation templates.
* **Dynamic Forms:** Each template provides a unique, dynamically generated form tailored to its specific content generation needs.
* **AI-Powered Content Generation:** Submit your input through the forms, and the application will use an AI model to generate relevant content.
* **Responsive Design:** The application is designed to work seamlessly across various devices (mobile, tablet, desktop).

---

## Technologies Used

* **React:** A JavaScript library for building user interfaces.
* **Next.js:** A React framework for production-ready applications, enabling server-side rendering and static site generation.
* **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
* **Shadcn UI:** A collection of reusable components built with Radix UI and Tailwind CSS.
* **Lucide React:** A set of beautiful and consistent open-source icons.
* **AI Integration:** Utilizes an AI backend (likely via server actions) to process user prompts and generate content.

---

## Setup

Follow these steps to get the project up and running on your local machine.

### Prerequisites

* **Node.js** (LTS version recommended)
* **npm** or **Yarn**

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd ai-content-generator
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Set up Environment Variables:**
    If your AI backend requires API keys or other sensitive information, create a `.env.local` file in the root directory and add the necessary variables. For example:
    ```
    NEXT_PUBLIC_AI_API_KEY=your_ai_api_key_here
    ```

### Running the Application

To start the development server:

```bash
npm run dev
# or
yarn dev
