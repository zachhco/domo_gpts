import React, { useState } from 'react';
import './gpt-selector.css';
import './conversation.css';
import { GptList } from './GptList';
import { Conversation } from './Conversation';

function App() {
  const [currentGpt, setCurrentGpt] = useState(null)

  function handleGptSelected(gptSlug) {
    setCurrentGpt(gptSlug)
  }

  function handleBack() {
    setCurrentGpt(null)
  }

  return currentGpt ? <Conversation onBack={handleBack} selectedGptSlug={currentGpt} /> : <GptList onSelectGpt={handleGptSelected} />
}

export default App;
