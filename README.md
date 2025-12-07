# TruthLens - AI-Powered Misinformation Detector

**TruthLens** is a modern media literacy tool designed to help users identify potential misinformation, logical fallacies, and emotional manipulation in news articles, social media posts, and online content. 

Powered by **Google Gemini 3** and **Google Search Grounding**, it acts as a digital fact-checker that not only scores credibility but educates users on *why* content might be misleading.



## 🚀 Key Features

*   **AI-Powered Analysis**: Uses the advanced `gemini-3-pro-preview` model to deeply analyze text for bias, strawman arguments, and sensationalism.
*   **Google Search Grounding**: Automatically verifies claims against the live web to prevent AI hallucinations. It checks specific URLs (like YouTube videos or news links) to find corroborating or debunking sources.
*   **Trust Score & Verdict**: Visualizes credibility with a 0-100 Trust Score and a clear verdict (Credible, Questionable, Misleading, etc.).
*   **Fallacy Detection**: Identifies specific logical fallacies (e.g., Ad Hominem, False Dichotomy) and highlights exactly where they occur in the text.
*   **Multimodal Support**: Analyzes images and screenshots to detect visual manipulation or misleading contexts.
*   **Media Literacy Insights**: Provides educational context to help users improve their own critical thinking skills.

## 🛠️ Tech Stack

*   **Frontend**: React (TypeScript)
*   **Styling**: Tailwind CSS (with custom animations and glassmorphism design)
*   **AI Model**: Google Gemini 3 (`gemini-3-pro-preview`)
*   **SDK**: `@google/genai`
*   **Icons**: Lucide React

## ⚙️ Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/truthlens.git
    cd truthlens
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure API Key**
    TruthLens requires a valid Google GenAI API Key with access to the Gemini 3 models and Search Grounding.
    
    *   Create a `.env` file in the root directory.
    *   Add your API key:
        ```env
        API_KEY=your_google_genai_api_key_here
        ```
    *   *Note: Ensure your API key has permissions for `gemini-3-pro-preview`.*

4.  **Run the application**
    ```bash
    npm start
    ```

## 📖 How It Works

1.  **Input**: The user pastes text, a URL (e.g., YouTube link), or uploads an image.
2.  **Gemini 3 Analysis**: The app sends the content to the Gemini 3 model with specific system instructions to act as a media literacy expert.
3.  **Search Grounding**: If URLs or factual claims are detected, the model triggers the Google Search tool to verify the information against trusted external sources.
4.  **Synthesis**: The AI combines its linguistic analysis with the search results to generate a structured JSON report containing the score, summary, and educational insights.

## ⚠️ Disclaimer

TruthLens is an AI tool designed to assist with critical thinking, not replace it. While it uses advanced grounding to verify facts, AI can still make mistakes. Always verify important information with primary sources.

## 📄 License

MIT License
