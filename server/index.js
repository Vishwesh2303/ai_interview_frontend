express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { InferenceClient } = require('@huggingface/inference');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const HF_API_KEY = process.env.HF_API_KEY;
const client = new InferenceClient(HF_API_KEY);

app.post('/api/interview', async (req, res) => {
  const { question } = req.body;

  try {
    const result = await client.chatCompletion({
      model: "zai-org/GLM-5.1:together",
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
    });

    const aiReply = result.choices?.[0]?.message?.content || 'No response received.';
    res.json({ answer: aiReply });
  } catch (error) {
    console.error('HF API Error:', error.message);
    res.status(500).json({ answer: '❌ Error connecting to Hugging Face API.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});