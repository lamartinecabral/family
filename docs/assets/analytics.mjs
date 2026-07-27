import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import {
  getAnalytics,
  logEvent,
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-analytics.js";

async function initAnalytics() {
  const firebaseConfig = {
    ...JSON.parse(
      atob(
        "IHsgImFwaUtleSI6IkFJemFTeUFmbzlXUzFSMG5lYlBiTHJYU29ack5pTjJxbk9XMVU5TSJ9",
      ),
    ),
    authDomain: "lamart-analytics.firebaseapp.com",
    projectId: "lamart-analytics",
    storageBucket: "lamart-analytics.firebasestorage.app",
    messagingSenderId: "100586889774",
    appId: "1:100586889774:web:ca36219ee0bf07c480f5bf",
    measurementId: "G-FZTHJJTRZV",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  logEvent(analytics, "nomes_da_terra_page_view");
}

if (globalThis.location?.hostname === "lamartinecabral.github.io")
  initAnalytics();
