import { Hono } from 'hono';
import { cors } from 'hono/cors'
import { makeResponse } from './makeResponse'
import { assistantSlugToIdMap } from './assistantSlugToIdMap'
import { Env } from './env';
import { buildOpenAiClient } from './buildOpenAiClient';

const app = new Hono<{ Bindings: Env }>();

app.use('/*', cors());

app.post('/assistants/:assistantSlug/conversation', async (ctx) => {
	const openAiClient = buildOpenAiClient(ctx.env)
	try {
		const { assistantSlug } = ctx.req.param()
		const { threadId, message } = await ctx.req.json()
		const assistantId = assistantSlugToIdMap[assistantSlug]
		if (!assistantId) return makeResponse({ message: `No assistant id for slug: ${assistantSlug}` })
		let currentThreadId = threadId
		if (!threadId) {
			const thread = await openAiClient.beta.threads.create()
			currentThreadId = thread.id
		}
		await openAiClient.beta.threads.messages.create(
			currentThreadId,
			{
				role: "user",
				content: message
			}
		);
		const text = await new Promise<string>((resolve) => {
			let tempText = ''
			openAiClient.beta.threads.runs.stream(currentThreadId, { assistant_id: assistantId })
				.on('messageDone', (msg) => tempText += `${msg.content.filter(content => content.type === 'text').map(content => content.text.value).join('\n')}\n`)
				.on('end', () => resolve(tempText))
		})
		return makeResponse({ text, threadId: currentThreadId })
	} catch (error) {
		console.error('Error executing SQL query:', error);
		return makeResponse({ error: 'Internal Server Error' }, 500);
	}
})

export default app;
