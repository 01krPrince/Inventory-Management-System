// src/services/greetingService.ts

export const getTimeBasedGreeting = (name?: string): string => {
  const hour = new Date().getHours();

  let greeting = "";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  // Default name if not provided
  const finalName = name?.trim() || "and welcome to the Inventory Dashboard Demo";

  return `${greeting} ${finalName}`;
};

export const speakGreeting = (name?: string) => {
  if (!("speechSynthesis" in window)) return;

  const message = getTimeBasedGreeting(name);
  const utterance = new SpeechSynthesisUtterance(message);

  // 🎯 Indian English settings
  utterance.lang = "en-IN";
  utterance.rate = 0.95;   // natural pace
  utterance.pitch = 1;
  utterance.volume = 0.9;

  const voices = window.speechSynthesis.getVoices();

  // 🔎 Try to find Indian English voice first
  const indianVoice =
    voices.find(v => v.lang === "en-IN") ||
    voices.find(v => v.name.toLowerCase().includes("india")) ||
    voices.find(v => v.name.toLowerCase().includes("google") && v.lang.includes("en"));

  if (indianVoice) {
    utterance.voice = indianVoice;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

