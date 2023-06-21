import { useGraphQlJit } from '@envelop/graphql-jit';
import { createYoga } from 'graphql-yoga';
import type { RequestEvent } from '@sveltejs/kit';
import { renderGraphiQL } from '@graphql-yoga/render-graphiql';
import { makeSchema, queryType } from 'nexus';
import path, { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const Query = queryType({
	definition(t) {
		t.string('hello', {
			resolve: () => 'SvelteKit - Nexus!'
		});
	}
});

const schema = makeSchema({
	types: [Query],
	outputs: {
		schema: join(__dirname, 'schema.graphql'),
		typegen: join(__dirname, 'test.ts')
	}
});

const yogaApp = createYoga<RequestEvent>({
	logging: false,
	schema: schema,
	plugins: [useGraphQlJit()],
	graphqlEndpoint: '/api/graphql',
	renderGraphiQL,
	graphiql: {
		defaultQuery: `query { hello }`
	},
	fetchAPI: globalThis
});

export { yogaApp as GET, yogaApp as POST };
