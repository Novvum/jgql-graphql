import { ApolloServer } from "apollo-server-micro";
import { createMergedSchema } from '../src/resolvers'
import { LibrariesIO } from '../src/models/LibrariesIOModel'
import { NpmsApiModel } from '../src/models/NpmsApiModel'

const server = new ApolloServer({
  schema: createMergedSchema(),
  context: (req) => ({
    ...req,
    libs: new LibrariesIO(
      process.env.DEPSAUCE_LIBIO_KEY || '24f103aa26ca1bf89661c060b0bdb1d9'
    ),
    npms: new NpmsApiModel(),
  }),
  // tracing: process.env.DEPSAUCE_APP_STAGE === 'production' ? false : true,
  // engine: {
  //   apiKey:
  //     process.env.DEPSAUCE_ENGINE_API_KEY ||
  //     'service:depsauce-graphql:KL6-EH_VFe0p-wQpPj9OaA',
  //   schemaTag: process.env.DEPSAUCE_ENGINE_SCHEMA_TAG || 'production',
  // },
  // playground: true,
  introspection: true,
})

const startServer = server.start();
const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

async function handler(req, res) {

  await startServer;
  await server.createHandler({
    path: "/api/graphql",
  })(req, res);
}
export default handler // allowCors(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
