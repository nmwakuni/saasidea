import { createClient } from '@deepgram/sdk';

if (!process.env.DEEPGRAM_API_KEY) {
  console.warn('DEEPGRAM_API_KEY not set - transcription will not work');
}

const deepgram = process.env.DEEPGRAM_API_KEY
  ? createClient(process.env.DEEPGRAM_API_KEY)
  : null;

export interface TranscriptionOptions {
  fileUrl?: string;
  fileBuffer?: Buffer;
  language?: string;
  model?: 'nova-2' | 'nova' | 'enhanced' | 'base';
  diarize?: boolean; // Speaker diarization
  punctuate?: boolean;
  paragraphs?: boolean;
}

export interface TranscriptionResult {
  transcript: string;
  confidence: number;
  words?: Array<{
    word: string;
    start: number;
    end: number;
    confidence: number;
    speaker?: number;
  }>;
  paragraphs?: Array<{
    sentences: Array<{
      text: string;
      start: number;
      end: number;
    }>;
    speaker?: number;
    start: number;
    end: number;
  }>;
  metadata: {
    duration: number;
    channels: number;
    model: string;
  };
}

export async function transcribeAudio(
  options: TranscriptionOptions
): Promise<TranscriptionResult> {
  if (!deepgram) {
    throw new Error('Deepgram client not initialized - check API key');
  }

  const {
    fileUrl,
    fileBuffer,
    language = 'en',
    model = 'nova-2',
    diarize = true,
    punctuate = true,
    paragraphs = true,
  } = options;

  try {
    let response;

    if (fileUrl) {
      // Transcribe from URL
      response = await deepgram.listen.prerecorded.transcribeUrl(
        {
          url: fileUrl,
        },
        {
          model,
          language,
          punctuate,
          diarize,
          paragraphs,
          utterances: true,
          smart_format: true,
        }
      );
    } else if (fileBuffer) {
      // Transcribe from buffer
      response = await deepgram.listen.prerecorded.transcribeFile(
        fileBuffer,
        {
          model,
          language,
          punctuate,
          diarize,
          paragraphs,
          utterances: true,
          smart_format: true,
        }
      );
    } else {
      throw new Error('Either fileUrl or fileBuffer must be provided');
    }

    const result = response.result;
    const channel = result.results?.channels[0];
    const alternative = channel?.alternatives[0];

    if (!alternative) {
      throw new Error('No transcription result found');
    }

    // Extract paragraphs if available
    const extractedParagraphs = alternative.paragraphs?.paragraphs?.map(
      (para) => ({
        sentences: para.sentences.map((sent) => ({
          text: sent.text,
          start: sent.start,
          end: sent.end,
        })),
        speaker: para.speaker,
        start: para.start,
        end: para.end,
      })
    );

    return {
      transcript: alternative.transcript,
      confidence: alternative.confidence,
      words: alternative.words?.map((word) => ({
        word: word.word,
        start: word.start,
        end: word.end,
        confidence: word.confidence,
        speaker: word.speaker,
      })),
      paragraphs: extractedParagraphs,
      metadata: {
        duration: result.metadata?.duration || 0,
        channels: result.metadata?.channels || 1,
        model: result.metadata?.model_info?.name || model,
      },
    };
  } catch (error) {
    console.error('Deepgram transcription failed:', error);
    throw error;
  }
}

// Format transcript with speaker labels
export function formatTranscriptWithSpeakers(
  result: TranscriptionResult
): string {
  if (!result.paragraphs || result.paragraphs.length === 0) {
    return result.transcript;
  }

  let formatted = '';
  let currentSpeaker: number | undefined;

  for (const para of result.paragraphs) {
    // Add speaker label if it changed
    if (para.speaker !== undefined && para.speaker !== currentSpeaker) {
      currentSpeaker = para.speaker;
      formatted += `\n\n[Speaker ${para.speaker + 1}]:\n`;
    }

    // Add paragraph text
    const paraText = para.sentences.map((s) => s.text).join(' ');
    formatted += paraText + '\n';
  }

  return formatted.trim();
}

// Extract timestamps for creating video clips
export function extractTimestampedSegments(
  result: TranscriptionResult,
  segmentLength: number = 60 // seconds
): Array<{
  text: string;
  start: number;
  end: number;
  speaker?: number;
}> {
  if (!result.paragraphs) {
    return [];
  }

  const segments: Array<{
    text: string;
    start: number;
    end: number;
    speaker?: number;
  }> = [];

  for (const para of result.paragraphs) {
    const paraText = para.sentences.map((s) => s.text).join(' ');
    const duration = para.end - para.start;

    if (duration <= segmentLength) {
      // Paragraph fits in one segment
      segments.push({
        text: paraText,
        start: para.start,
        end: para.end,
        speaker: para.speaker,
      });
    } else {
      // Split long paragraphs into segments
      let currentSegment = '';
      let segmentStart = para.start;
      let segmentEnd = para.start;

      for (const sentence of para.sentences) {
        const sentenceDuration = sentence.end - sentence.start;

        if (segmentEnd - segmentStart + sentenceDuration > segmentLength) {
          // Save current segment and start new one
          if (currentSegment) {
            segments.push({
              text: currentSegment.trim(),
              start: segmentStart,
              end: segmentEnd,
              speaker: para.speaker,
            });
          }
          currentSegment = sentence.text;
          segmentStart = sentence.start;
          segmentEnd = sentence.end;
        } else {
          currentSegment += ' ' + sentence.text;
          segmentEnd = sentence.end;
        }
      }

      // Add final segment
      if (currentSegment) {
        segments.push({
          text: currentSegment.trim(),
          start: segmentStart,
          end: segmentEnd,
          speaker: para.speaker,
        });
      }
    }
  }

  return segments;
}

// Health check for Deepgram API
export async function checkDeepgramHealth(): Promise<boolean> {
  if (!deepgram) {
    return false;
  }

  try {
    // Try to get API key info
    const response = await fetch('https://api.deepgram.com/v1/projects', {
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
      },
    });
    return response.ok;
  } catch (error) {
    console.error('Deepgram health check failed:', error);
    return false;
  }
}
