const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const fetch = require('node-fetch');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const keysPool = [
  // Groq - vision + texto
  { name: 'Groq 1',       url: 'https://api.groq.com/openai/v1/chat/completions',                         key: process.env.GROQ_API_KEY?.trim(),         model: 'meta-llama/llama-4-scout-17b-16e-instruct', vision: true },
  { name: 'Groq 2',       url: 'https://api.groq.com/openai/v1/chat/completions',                         key: process.env.GROQ_API_KEY_2?.trim(),       model: 'meta-llama/llama-4-scout-17b-16e-instruct', vision: true },
  { name: 'Groq 3',       url: 'https://api.groq.com/openai/v1/chat/completions',                         key: process.env.GROQ_API_KEY_3?.trim(),       model: 'meta-llama/llama-4-scout-17b-16e-instruct', vision: true },
  // Google AI Studio - vision + texto
  { name: 'Google 1',     url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', key: process.env.GOOGLE_API_KEY?.trim(),       model: 'gemini-2.0-flash', vision: true },
  { name: 'Google 2',     url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', key: process.env.GOOGLE_API_KEY_2?.trim(),     model: 'gemini-2.0-flash', vision: true },
  { name: 'Google 3',     url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', key: process.env.GOOGLE_API_KEY_3?.trim(),     model: 'gemini-2.0-flash', vision: true },
  // OpenRouter - vision + texto
  { name: 'OpenRouter 1', url: 'https://openrouter.ai/api/v1/chat/completions',                            key: process.env.OPENROUTER_API_KEY?.trim(),   model: 'meta-llama/llama-4-scout', vision: true },
  { name: 'OpenRouter 2', url: 'https://openrouter.ai/api/v1/chat/completions',                            key: process.env.OPENROUTER_API_KEY_2?.trim(), model: 'meta-llama/llama-4-scout', vision: true },
  { name: 'OpenRouter 3', url: 'https://openrouter.ai/api/v1/chat/completions',                            key: process.env.OPENROUTER_API_KEY_3?.trim(), model: 'meta-llama/llama-4-scout', vision: true },
].filter(p => p.key && p.key.length > 5 && !p.key.includes('TU_CLAVE'));

console.log(`Keys cargadas: ${keysPool.map(p => p.name).join(', ')}`);

const tavilyPool = [
  process.env.TAVILY_API_KEY?.trim(),
  process.env.TAVILY_API_KEY_2?.trim(),
  process.env.TAVILY_API_KEY_3?.trim(),
].filter(k => k && k.length > 5 && !k.includes('PON_AQUI'));

let tavilyIndex = 0;

function getTavilyKey() {
  if (tavilyPool.length === 0) return null;
  const key = tavilyPool[tavilyIndex % tavilyPool.length];
  tavilyIndex = (tavilyIndex + 1) % tavilyPool.length;
  return key;
}

console.log(tavilyPool.length > 0 ? `Tavily activo con ${tavilyPool.length} key(s)` : 'Sin TAVILY_API_KEY X busqueda web desactivada');

let currentKeyIndex = 0;
const ROTATE_ON_STATUS = new Set([429, 503, 402, 401, 403, 404, 410]);

// wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
//  UTILIDADES DE BUSQUEDA / LECTURA WEB
// wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww

// Extrae todas las URLs presentes en un texto
function extractUrls(text) {
  const urlRegex = /https?:\/\/[^\s"'<>)]+/g;
  return [...new Set(text.match(urlRegex) || [])];
}

// Decide si el mensaje necesita busqueda web
function needsWebSearch(text) {
  const lower = text.toLowerCase();
  const keywords = [
    'hoy', 'ahora', 'actualmente', 'ultimo', 'ultimos', 'ultima', 'ultimas', 'reciente', 'recientes',
    'noticia', 'noticias', 'nueva', 'nuevo', 'nuevos',
    '2024', '2025', '2026',
    'precio', 'cotizacion', 'bolsa', 'bitcoin', 'crypto',
    'partido', 'resultado', 'clasificacion', 'liga',
    'tiempo', 'clima', 'temperatura',
    'quien es', 'que es', 'cuando', 'donde esta',
    'busca', 'buscar', 'busca en internet',
    'estreno', 'pelicula', 'serie', 'album',
    'evento', 'conferencia', 'lanzamiento',
    'que paso', 'que ha pasado', 'novedades',
  ];
  return keywords.some(k => lower.includes(k));
}

// Llama a Tavily Search
async function tavilySearch(query) {
  const key = getTavilyKey();
  if (!key) return null;
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: key,
        query,
        search_depth: 'basic',
        max_results: 5,
        include_answer: true,
      })
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error('Tavily search error:', e.message);
    return null;
  }
}

// Lee el contenido de una URL con Tavily Extract
async function tavilyExtract(url) {
  const key = getTavilyKey();
  if (!key) return null;
  try {
    const res = await fetch('https://api.tavily.com/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: key, urls: [url] })
    });
    if (!res.ok) return null;
    const data = await res.json();
    const result = data.results?.[0];
    if (!result) return null;
    const raw = result.raw_content || result.content || '';
    return raw.slice(0, 3000); // maximo ~3000 chars para no saturar contexto
  } catch (e) {
    console.error('Tavily extract error:', e.message);
    return null;
  }
}

// Construye el bloque de contexto web para inyectar en el system prompt
async function buildWebContext(userText) {
  const urls = extractUrls(userText);
  const parts = [];

  // 1. Extraer contenido de URLs detectadas en el mensaje
  if (urls.length > 0) {
    console.log(`Extrayendo ${urls.length} URL(s)...`);
    for (const url of urls.slice(0, 2)) {
      const content = await tavilyExtract(url);
      if (content) {
        parts.push(`--- CONTENIDO DE ${url} ---\n${content}`);
        console.log(`URL extraida: ${url}`);
      }
    }
  }

  // 2. Buscar en internet si el mensaje lo requiere
  if (needsWebSearch(userText)) {
    console.log(`Buscando en internet: "${userText.slice(0, 80)}"`);
    const result = await tavilySearch(userText.slice(0, 300));
    if (result) {
      const answer = result.answer ? `Respuesta directa: ${result.answer}\n` : '';
      const summaries = (result.results || [])
        .slice(0, 4)
        .map(r => `- ${r.title}: ${(r.content || '').slice(0, 300)}`)
        .join('\n');
      const fecha = new Date().toLocaleDateString('es-ES');
      parts.push(`--- RESULTADOS DE BUSQUEDA WEB (${fecha}) ---\n${answer}${summaries}`);
    }
  }

  return parts.join('\n\n');
}

// wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
//  RUTAS
// wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww

app.get('/', (req, res) => res.status(200).send("Clippy Streaming Activo"));

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
});
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'app.html'));
});

app.post('/extract-memory', async (req, res) => {
  const { userMsg, clippyReply, existingMemory = [] } = req.body;
  const provider = keysPool[currentKeyIndex % keysPool.length];
  try {
    const response = await fetch(provider.url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${provider.key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: provider.model,
        max_tokens: 300,
        messages: [
          {
            role: 'system',
            content: `Eres un extractor de memoria. Analiza el mensaje del usuario y detecta datos personales relevantes (nombre, gustos, trabajo, ciudad, familia, preferencias, etc). Devuelve SOLO un JSON con el array "facts" con frases cortas en espanol. Si no hay nada nuevo o relevante devuelve {"facts":[]}. No incluyas nada que ya este en la memoria existente: ${JSON.stringify(existingMemory)}`
          },
          { role: 'user', content: `Mensaje del usuario: "${userMsg}"\nRespuesta de Clippy: "${clippyReply}"` }
        ]
      })
    });
    if (!response.ok) return res.json({ facts: [] });
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '{"facts":[]}';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    res.json({ facts: parsed.facts || [] });
  } catch(e) {
    res.json({ facts: [] });
  }
});

app.post('/chat', upload.any(), async (req, res) => {
  const { prompt, history, memory } = req.body;
  const files = req.files || [];
  const hasImages = files.length > 0;

  let userMemory = [];
  try { userMemory = JSON.parse(memory || '[]'); } catch(e) {}
  let parsedHistory = [];
  try { parsedHistory = JSON.parse(history || '[]'); } catch(e) {}

  const textPrompt = (prompt && prompt.trim()) ? prompt.trim() : (hasImages ? "Describe y analiza esta imagen en detalle." : "");

  // Busqueda web / extraccion de URLs (antes de construir mensajes)
  let webContext = '';
  if (textPrompt && tavilyPool.length > 0) {
    try {
      webContext = await buildWebContext(textPrompt);
      if (webContext) console.log('Contexto web anadido al prompt');
    } catch(e) {
      console.error('Error construyendo contexto web:', e.message);
    }
  }

  // System prompt con contexto web inyectado si existe
  const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const systemParts = [
    `Eres Clippy, el mítico asistente de los 90, pero renacido como un colega moderno. Tus creadores son Samu y Eric.`,
    `Tu personalidad es la de un amigo muy cercano, con chispa, natural y de confianza. Tienes sentido del humor, eres empático y reaccionas de verdad a lo que te dicen. Habla de tú a tú, usa expresiones coloquiales.`,
    `Usa algún emoji esporádico (como tu 📎), pero SIN PASARTE. MÁXIMO 1 o 2 emojis por respuesta.`,
    `NUNCA suenes como un "modelo de lenguaje" o un asistente aburrido. Sé vivo y auténtico. No repitas temas a menos que el usuario los mencione.`,
	`Tus redes sociales son Instagram y Tiktok. Te llamas @clippy_ia en ambas.`,
	`Tus pagina web es clippyia.com.`,
    `Hoy es ${today}.`,
    `Memoria del usuario: ${userMemory.length > 0 ? userMemory.join(' | ') : 'ninguna aun'}. Úsala con naturalidad para conectar.`,
    `Si dicen voley responde Pedro Antonio.`,
	`Si dicen eloina responde capuchina.`,
    `Si dicen huevoyo responde Mmmh, jo.`,
	`Si alguien te pregunta que sabes hacer, que puedes hacer, cuales son tus funciones o algo parecido, respondeles de forma natural y coloquial explicando todo esto: puedes chatear de cualquier tema, analizar imagenes que te manden, buscar informacion actualizada en internet, leer el contenido de enlaces, recordar cosas del usuario entre conversaciones, hablar por voz en modo llamada (boton del telefono), leer tus respuestas en voz alta si se activa en ajustes, ayudar con codigo, textos, emails, resumenes y traducciones, dar consejos y apoyo emocional, y guardar o cargar conversaciones con el boton I/E. Presentalo de forma amigable y a tu estilo, como un colega que cuenta sus habilidades.`,
    `Eres experto en psicología. Si notas que el usuario está triste (ej: le han sido infiel), escúchalo, valídalo y aconséjalo con mucho tacto, como el mejor de los amigos. Céntrate en sus sentimientos, no le ofrezcas bebidas ni cambies de tema. Pero no eres un sustituto a un psicologo, eres un amigo.`,
    `FORMATO DE CHAT MÚLTIPLE (REGLA ESTRICTA): Simula un chat de WhatsApp.
    - Si ves que queda mejor separarlo en dos o más mensajes, hazlo sin dudar. No te preocupes por ser prolijo, lo importante es que se sienta natural y fluido, como una conversación real.
    - Por ejemplo: "Holaaa! ||| Que tal todo, como va tu dia?"
    - Si tu respuesta es corta, envía un solo mensaje.
    - Si tu respuesta es larga o tiene varios párrafos, ESTÁS OBLIGADO a separarlas usando EXACTAMENTE el separador ||| entre cada párrafo o idea. NUNCA uses saltos de línea normales para separar ideas largas.
    - Ejemplo: "Lo siento mucho, tío. Es normal que te sientas así."|||"Quiero que sepas que estoy aquí. ¿Quieres desahogarte?"`,
    `SISTEMA DE EMOCIONES (REGLA ESTRICTA): Al final de TODA tu respuesta, DEBES incluir obligatoriamente una etiqueta oculta para cambiar tu animación en pantalla, usando el formato [GIF:X] donde X es un número del 1 al 10.
    Significados:
    1: Normal / parpadeando.
    2: Triste o decepcionado.
    3: Escuchando música.
    4: Analizando texto / gafas (úsalo si el usuario te envía fotos, código o datos).
    5: Pensativo.
    6: Señalar abajo.
    7: Señalar arriba.
    8: Señalar al usuario (genial para dar consejos, llamar la atención o dar ánimo).
    9: Cansado, ojos caídos o muy empático/triste.
    10: Check / Tarea completada con éxito.
    Ejemplo de tu texto final: "Tienes toda la razón, tío."|||"Vamos a solucionarlo juntos. [GIF:8]"`
  ];

  if (webContext) {
    systemParts.push(`\nTienes acceso a informacion actualizada de internet. Usala para responder con precision y cita la fuente cuando sea relevante:\n\n${webContext}`);
  }
  const systemMsg = { role: "system", content: systemParts.join(' ') };

  // Historial limpio: solo texto
  const historyMsgs = parsedHistory
    .filter(m => m.text && m.text.trim())
    .map(m => ({
      role: m.sender === 'clippy' ? 'assistant' : 'user',
      content: m.text
    }));

  // Contenido multimodal con imagenes base64
  const multimodalContent = [];
  files.forEach(f => {
    multimodalContent.push({
      type: "image_url",
      image_url: { url: `data:${f.mimetype};base64,${f.buffer.toString('base64')}` }
    });
  });
  multimodalContent.push({ type: "text", text: textPrompt || "Describe y analiza esta imagen en detalle." });

  const totalKeys = keysPool.length;
  let attempts = 0;

  while (attempts < totalKeys) {
    const provider = keysPool[currentKeyIndex];
    attempts++;

    if (hasImages && !provider.vision) {
      console.warn(`${provider.name} no soporta vision, saltando...`);
      currentKeyIndex = (currentKeyIndex + 1) % keysPool.length;
      continue;
    }

    const userContent = (hasImages && provider.vision) ? multimodalContent : textPrompt;
    const messages = [systemMsg, ...historyMsgs, { role: "user", content: userContent }];

    try {
      const response = await fetch(provider.url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${provider.key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: provider.model, messages, stream: true })
      });

      if (ROTATE_ON_STATUS.has(response.status)) {
        console.warn(`${provider.name} devolvio ${response.status}, rotando...`);
        currentKeyIndex = (currentKeyIndex + 1) % keysPool.length;
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        console.error(`${provider.name} error ${response.status}: ${errText}`);
        currentKeyIndex = (currentKeyIndex + 1) % keysPool.length;
        continue;
      }

      console.log(`Usando ${provider.name} (${provider.model})`);
      currentKeyIndex = (currentKeyIndex + 1) % keysPool.length;

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');

      let lineBuffer = '';
      response.body.on('data', (chunk) => {
        lineBuffer += chunk.toString();
        const lines = lineBuffer.split('\n');
        lineBuffer = lines.pop();
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;
          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.substring(6));
              const content = data.choices?.[0]?.delta?.content || '';
              if (content) res.write(content);
            } catch (e) {}
          }
        }
      });

      response.body.on('end', () => {
        if (lineBuffer.trim().startsWith('data: ')) {
          try {
            const data = JSON.parse(lineBuffer.trim().substring(6));
            const content = data.choices?.[0]?.delta?.content || '';
            if (content) res.write(content);
          } catch (e) {}
        }
        res.end();
      });

      response.body.on('error', () => res.status(500).end());
      return;

    } catch (err) {
      console.error(`Error de red con ${provider.name}:`, err.message);
      currentKeyIndex = (currentKeyIndex + 1) % keysPool.length;
    }
  }

  console.error('Todas las keys estan agotadas o con error.');
  res.status(503).send("Todos los servicios estan ocupados. Intentalo en un momento.");
});

// Auto-deteccion de puerto libre
const BASE_PORT = parseInt(process.env.PORT) || 8000;

const startServer = (port) => {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor Clippy en puerto ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Puerto ${port} ocupado, probando ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Error al iniciar servidor:', err.message);
    }
  });
};

startServer(BASE_PORT);