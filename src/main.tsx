import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import './index.css'
import App from './App.tsx'

// Amplify configuration will be loaded when amplify_outputs.json is generated
// This is wrapped in a function to avoid build-time errors
const loadAmplifyConfig = async () => {
  try {
    const outputs = await import('../amplify_outputs.json')
    Amplify.configure(outputs.default)
  } catch (error) {
    console.log('Amplify outputs not found. Run "npx ampx sandbox" to generate amplify_outputs.json')
  }
}

loadAmplifyConfig()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
