import { ApolloServer } from 'apollo-server'
import { createMergedSchema } from './resolvers'
import { LibrariesIO } from './models/LibrariesIOModel'
import { NpmsApiModel } from './models/NpmsApiModel'

const run = async () => {
  const server = new ApolloServer({
    schema: await createMergedSchema(),
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
    cors: true,
  })
  return server
}

run().then((server) => {
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })
})

export default run
