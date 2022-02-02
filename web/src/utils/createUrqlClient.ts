import { debugExchange, Exchange, fetchExchange, stringifyVariables } from 'urql';
import { cacheExchange, Resolver } from '@urql/exchange-graphcache';
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql';
import betterUpdateQuery from './betterUpdateQuery';
import { pipe, tap } from 'wonka';
import Router from 'next/router';

export const errorExchange: Exchange = ({ forward }) => ops$ => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error?.message.includes("not authenticated")) {
        Router.replace("/login");
      }
    })
  );
}

export const cursorPagination = ( cursorArgument = "cursor"): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isInInTheCache = cache.resolveFieldByKey(entityKey, fieldKey);
    info.partial = !isInInTheCache;
    const results: string [] = [];
    fieldInfos.forEach((fi) => {
      const data = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string[];
      results.push(...data);
    });
    return results;
  }
}

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: { credentials: "include" as const },
  exchanges: [debugExchange, cacheExchange({
    resolvers: {
      Query: {
        posts: cursorPagination()
      }
    },
    updates: {
      Mutation: {
        logout: (_result, args, cache: Cache, info) => {
          betterUpdateQuery<LogoutMutation, MeQuery>(cache, {query: MeDocument}, _result, () => ({ me: null }));
        },
        login: (_result, args, cache: Cache, info) => {
          betterUpdateQuery<LoginMutation, MeQuery>(cache, {query: MeDocument}, _result, (result, query) => {
            if (result.login.errors) {
              return query;
            } else {
              return {me: result.login.user};
            }
          });
        },
        register: (_result: RegisterMutation, args, cache, info) => {
          cache.updateQuery({ query: MeDocument }, (data: MeQuery) => {});
          betterUpdateQuery<LoginMutation, MeQuery>(cache, {query: MeDocument}, _result, (result, query) => {
            if (result.register.errors) {
              return query;
            } else {
              return {me: result.register.user};
            }
          });
        }
      }
    },
  }),
    ssrExchange,
    errorExchange,
    fetchExchange,
  ]
});
