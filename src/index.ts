import { ApolloServer } from "@saeris/apollo-server-vercel";
import { createMergedSchema } from './resolvers'
import { LibrariesIO } from './models/LibrariesIOModel'
import { NpmsApiModel } from './models/NpmsApiModel'

const server = new ApolloServer({
  schema: createMergedSchema(),
  context: (req) => ({
    ...req,
    libs: new LibrariesIO(
      process.env.DEPSAUCE_LIBIO_KEY || '24f103aa26ca1bf89661c060b0bdb1d9'
    ),
    npms: new NpmsApiModel(),
  }),
  tracing: process.env.DEPSAUCE_APP_STAGE === 'production' ? false : true,
  engine: {
    apiKey:
      process.env.DEPSAUCE_ENGINE_API_KEY ||
      'service:depsauce-graphql:KL6-EH_VFe0p-wQpPj9OaA',
    schemaTag: process.env.DEPSAUCE_ENGINE_SCHEMA_TAG || 'production',
  },
  playground: { version: '1.8.10' },
  introspection: true,
})

export default server.createHandler();
