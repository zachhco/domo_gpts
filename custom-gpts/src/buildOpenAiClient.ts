import OpenAI from 'openai'
import { Env } from './env'

export function buildOpenAiClient(env: Env) {
	const apiKey = env.OPENAI_API_KEY?.trim()
	if (apiKey === undefined) throw new Error('OPENAI_API_KEY env var is not defined')
	return new OpenAI({ apiKey });
}
