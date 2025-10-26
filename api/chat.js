import { streamText } from 'ai'
import { createVertex } from '@ai-sdk/google-vertex'

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array requerido' })
    }

    const vertex = createVertex({
      project: process.env.VERTEX_AI_PROJECT_ID,
      location: process.env.VERTEX_AI_LOCATION,
      googleAuthOptions: {
        credentials: {
          client_email: process.env.VERTEX_AI_CLIENT_EMAIL,
          private_key: process.env.VERTEX_AI_PRIVATE_KEY?.replace(/\\n/g, '\n')
        }
      }
    })

    const model = vertex('gemini-2.0-flash')

    const result = await streamText({
      model,
      messages,
      temperature: 0.7
    })

    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache')

    for await (const textPart of result.textStream) {
      res.write(`0:${JSON.stringify(textPart)}\n`)
    }

    res.end()
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}
