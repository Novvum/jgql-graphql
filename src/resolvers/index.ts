import { Query } from './Query'
import {
  makeRemoteExecutableSchema,
  makeExecutableSchema,
  mergeSchemas,
} from 'graphql-tools'
import { HttpLink } from 'apollo-link-http'
import fetch from 'node-fetch'
import GraphQLJSON from 'graphql-type-json'
import { NPMSIO } from './NPMSIO'
import { LibrariesIO } from './LibrariesIO'
import { GithubRepository, GithubUser } from './Github'
import typeDefs from '../schemas/typeDefs'
import { buildClientSchema } from 'graphql'

import graphqlWeekly from '../schemas/graphql-weekly.json'

const depsauceResolvers: any = {
  Query,
  LibrariesIO,
  NPMSIO,
  GithubRepository,
  GithubUser,
  JSON: GraphQLJSON,
}

const depsauceSchema = makeExecutableSchema({
  typeDefs,
  resolvers: depsauceResolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  } as any,
})

const link = new HttpLink({
  uri: `https://api.graph.cool/simple/v1/cipb111pw5fgt01o0e7hvx2lf`,
  fetch: fetch as any,
})

export const createMergedSchema = () => {
  // const gqlWeeklySchema = await introspectSchema(link)

  const gqlWeeklyExecutableSchema = makeRemoteExecutableSchema({
    schema: buildClientSchema(graphqlWeekly as any),
    link,
  })

  const mergedSchema = mergeSchemas({
    schemas: [depsauceSchema, gqlWeeklyExecutableSchema],
  })
  return mergedSchema
}
