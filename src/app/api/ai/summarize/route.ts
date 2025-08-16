import { NextRequest, NextResponse } from 'next/server';
import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import axios from 'axios';
import fse from 'fs-extra';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function saveTempFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nl-'));
  const filePath = path.join(tmpDir, file.name || 'upload.bin');
  await fs.writeFile(filePath, buffer);
  return filePath;
}

async function uploadToAssemblyAI(filePath: string, apiKey: string): Promise<string> {
  const baseUrl = 'https://api.assemblyai.com';
  const headers = { authorization: apiKey } as const;
  const data = await fse.readFile(filePath);
  const uploadRes = await axios.post(`${baseUrl}/v2/upload`, data, { headers });
  return uploadRes.data.upload_url as string;
}

async function createTranscript(audioUrl: string, apiKey: string): Promise<{ id: string }> {
  const baseUrl = 'https://api.assemblyai.com';
  const headers = { authorization: apiKey } as const;
  const payload = { audio_url: audioUrl, speech_model: 'universal' };
  const res = await axios.post(`${baseUrl}/v2/transcript`, payload, { headers });
  return { id: res.data.id as string };
}

async function pollTranscript(id: string, apiKey: string, timeoutMs = 10 * 60 * 1000): Promise<{ text: string }>{
  const baseUrl = 'https://api.assemblyai.com';
  const headers = { authorization: apiKey } as const;
  const start = Date.now();
  while (true) {
    const res = await axios.get(`${baseUrl}/v2/transcript/${id}`, { headers });
    const st = res.data.status as string;
    if (st === 'completed') return { text: res.data.text as string };
    if (st === 'error') throw new Error(`Transcription failed: ${res.data.error}`);
    if (Date.now() - start > timeoutMs) throw new Error('Transcription timed out');
    await new Promise((r) => setTimeout(r, 3000));
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Use multipart/form-data with fields: audio (file) or audioUrl (string), optional prompt.' }, { status: 400 });
    }

    const form = await req.formData();
    const file = form.get('audio');
    const audioUrl = form.get('audioUrl');
    const prompt = (form.get('prompt') as string) || 'Summarize this lecture concisely with bullet points.';
    const providedTranscript = (form.get('transcript') as string) || '';
    const skipSummary = String(form.get('S') || '').toLowerCase() === 'true';

    // Enforce plain-text output with minimal special characters
    const outputPolicy = 'INSTRUCTIONS: Return PLAIN TEXT only. No markdown, no emojis, no bullet symbols, no headers, no special characters beyond basic ASCII punctuation. Keep it concise.';
    const effectivePrompt = `${outputPolicy}\n\n${prompt}`;

    // Fast path: If transcript is provided, skip AssemblyAI and only use Gemini
    if (providedTranscript) {
      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
      if (!GEMINI_API_KEY) {
        return NextResponse.json({ error: 'Server missing GEMINI_API_KEY' }, { status: 500 });
      }

      const geminiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            { parts: [ { text: `${effectivePrompt}\n\nContext transcript (for Q&A):\n${providedTranscript}` } ] },
          ],
        }),
      });

      if (!geminiRes.ok) {
        const errText = await geminiRes.text();
        return NextResponse.json({ error: 'Gemini API error', details: errText }, { status: 502 });
      }

      const geminiJson = await geminiRes.json();
      let summary = '';
      try {
        const candidates = geminiJson.candidates || [];
        const parts = candidates[0]?.content?.parts || [];
        summary = parts.map((p: any) => p.text).join('\n');
      } catch {
        summary = JSON.stringify(geminiJson);
      }

      return NextResponse.json({ transcript: providedTranscript, summary });
    }

    const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
    if (!ASSEMBLYAI_API_KEY) {
      return NextResponse.json({ error: 'Server missing ASSEMBLYAI_API_KEY' }, { status: 500 });
    }

    let assemblyAudioUrl: string | null = null;

    // Prefer direct URL to AssemblyAI when provided
    if (typeof audioUrl === 'string' && /^https?:\/\//i.test(audioUrl)) {
      assemblyAudioUrl = audioUrl;
    } else if (file && file instanceof File) {
      // Save and upload the file
      const inputPath = await saveTempFile(file);
      try {
        assemblyAudioUrl = await uploadToAssemblyAI(inputPath, ASSEMBLYAI_API_KEY);
      } catch (e: any) {
        return NextResponse.json({ error: 'Upload to AssemblyAI failed', details: e?.message || String(e) }, { status: 502 });
      }
    } else {
      return NextResponse.json({ error: 'Missing audio file or audioUrl' }, { status: 400 });
    }

    // 2) Create transcript
    let transcriptId: string;
    try {
      const { id } = await createTranscript(assemblyAudioUrl, ASSEMBLYAI_API_KEY);
      transcriptId = id;
    } catch (e: any) {
      return NextResponse.json({ error: 'Create transcript failed', details: e?.message || String(e) }, { status: 502 });
    }

    // 3) Poll until complete
    let transcriptText = '';
    try {
      const { text } = await pollTranscript(transcriptId, ASSEMBLYAI_API_KEY);
      transcriptText = text || '';
    } catch (e: any) {
      return NextResponse.json({ error: 'Polling transcript failed', details: e?.message || String(e) }, { status: 504 });
    }

    // If client only needs transcript (first-time), allow skipping Gemini
    if (skipSummary) {
      return NextResponse.json({ transcript: transcriptText });
    }

    // 4) Summarize with Gemini
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Server missing GEMINI_API_KEY' }, { status: 500 });
    }

    const geminiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          { parts: [ { text: `${effectivePrompt}\n\nTranscript:\n${transcriptText}` } ] },
        ],
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return NextResponse.json({ error: 'Gemini API error', details: errText }, { status: 502 });
    }

    const geminiJson = await geminiRes.json();
    let summary = '';
    try {
      const candidates = geminiJson.candidates || [];
      const parts = candidates[0]?.content?.parts || [];
      summary = parts.map((p: any) => p.text).join('\n');
    } catch {
      summary = JSON.stringify(geminiJson);
    }

    return NextResponse.json({ transcript: transcriptText, summary });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unknown error' }, { status: 500 });
  }
}
