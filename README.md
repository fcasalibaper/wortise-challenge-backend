# Wortise Challenge Backend

API backend para chat con IA usando Google Vertex AI y Gemini 2.0 Flash, desplegada en Vercel.

## Descripción

Este proyecto es una API serverless que proporciona un endpoint de chat con streaming en tiempo real utilizando el modelo Gemini 2.0 Flash de Google a través de Vertex AI. Está diseñado para ser consumido por aplicaciones frontend que requieren capacidades de conversación con IA.

## Características

- Streaming de respuestas en tiempo real
- Integración con Google Vertex AI (Gemini 2.0 Flash)
- CORS habilitado para peticiones cross-origin
- Desplegado como función serverless en Vercel
- Autenticación mediante Service Account de Google Cloud

## Tecnologías

- **Runtime**: Node.js (ES Modules)
- **Framework**: Vercel Serverless Functions
- **IA SDK**:
  - `@ai-sdk/google-vertex` - SDK para Google Vertex AI
  - `ai` - SDK de Vercel para streaming de IA
- **Validación**: Zod

## Requisitos Previos

- Node.js 18+
- Cuenta de Google Cloud Platform con Vertex AI habilitado
- Service Account de Google Cloud con permisos para Vertex AI
- Cuenta de Vercel (para despliegue)

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/fcasalibaper/wortise-challenge-backend.git
cd wortise-challenge-backend
```

2. Instalar dependencias:
```bash
npm install
# o
yarn install
```

3. Configurar variables de entorno:

Copiar el archivo `.env.example` a `.env` y completar con tus credenciales:

```bash
cp .env.example .env
```

## Uso

### API Endpoint

**POST** `/api/chat`

#### Request Body

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hola, ¿cómo estás?"
    }
  ]
}
```

#### Response

La respuesta es un stream de texto en formato:

```
0:"texto"
0:"más texto"
0:"aún más texto"
```

Cada línea contiene un fragmento de la respuesta generada por el modelo.

#### Ejemplo de Uso con Fetch

```javascript
const response = await fetch('https://tu-dominio.vercel.app/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Hola, ¿cómo estás?' }
    ]
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  console.log(chunk);
}
```

## Estructura del Proyecto

```
wortise-challenge-backend/
├── api/
│   └── chat.js           # Endpoint principal de chat
├── node_modules/
├── .env.example          # Plantilla de variables de entorno
├── .gitignore
├── package.json
├── vercel.json           # Configuración de Vercel (CORS)
└── README.md
```

## Seguridad

- Las credenciales sensibles nunca deben commitearse al repositorio
- Usa variables de entorno para todas las credenciales
- El archivo `.env` está incluido en `.gitignore`
- CORS está configurado para permitir todas las origenes (`*`) - ajusta según tus necesidades en producción

## Autor

Fernando Casaliba - [GitHub](https://github.com/fcasalibaper)

## Links

- [Repositorio](https://github.com/fcasalibaper/wortise-challenge-backend)
- [Google Vertex AI Docs](https://cloud.google.com/vertex-ai/docs)
- [Vercel Docs](https://vercel.com/docs)
- [AI SDK Docs](https://sdk.vercel.ai/docs)
