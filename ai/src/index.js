// ai/src/index.js
import app from './app.js';

const PORT = process.env.AI_PORT || 5001;

app.listen(PORT, () => {
  console.log(`[SecureChain-AI] Service listening on port ${PORT}`);
});
