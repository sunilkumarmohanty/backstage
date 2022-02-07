/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useMemo } from 'react';
import { useAsync } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';

import { githubOctokitApiRef } from '../api';

function useMemoizedScopes(scopes: string[]): string[] {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => scopes, [scopes.join('$$')]);
}

/**
 * Get an @octokit/rest instance for the provided GitHub hostname
 *
 * Specify which scopes you need access to (e.g. ['repo']). This array is
 * memoized, so it's not necessary to do this by the caller.
 *
 * @returns AsyncState<Octokit>
 */
export function useOctokitRest(hostname: string, scopes: string[]) {
  const githubOctokitApi = useApi(githubOctokitApiRef);

  const authScopes = useMemoizedScopes(scopes);

  return useAsync(
    () => githubOctokitApi.getRest(hostname, authScopes),
    [githubOctokitApi, hostname, authScopes],
  );
}

/**
 * Get an @octokit/rest instance for the provided entity.
 *
 * Specify which scopes you need access to (e.g. ['repo']). This array is
 * memoized, so it's not necessary to do this by the caller.
 *
 * Also return the {owner/repo} parts of the entity source url.
 *
 * @returns AsyncState<Octokit & {owner: string; repo: string;}>
 */
export function useOctokitRestForCustomEntity(
  entity: Entity,
  scopes: string[],
) {
  const githubOctokitApi = useApi(githubOctokitApiRef);

  const authScopes = useMemoizedScopes(scopes);

  return useAsync(
    () => githubOctokitApi.getRestForEntity(entity, authScopes),
    [githubOctokitApi, entity, authScopes],
  );
}

/**
 * Get an @octokit/rest instance for the current entity.
 *
 * Specify which scopes you need access to (e.g. ['repo']). This array is
 * memoized, so it's not necessary to do this by the caller.
 *
 * Also return the {owner/repo} parts of the entity source url.
 *
 * @returns AsyncState<Octokit & {owner: string; repo: string;}>
 */
export function useOctokitRestForEntity(scopes: string[]) {
  const { entity, loading, error } = useEntity();

  const githubOctokitApi = useApi(githubOctokitApiRef);

  const authScopes = useMemoizedScopes(scopes);

  const asyncState = useAsync(
    () => githubOctokitApi.getRestForEntity(entity, authScopes),
    [githubOctokitApi, entity, authScopes],
  );

  if (loading || asyncState.loading) {
    return { loading: true } as const;
  }
  if (error || asyncState.error) {
    return { error: error ?? asyncState.error! };
  }

  return { value: asyncState.value! };
}

/**
 * Get an @octokit/graphql instance for the provided GitHub hostname
 *
 * Specify which scopes you need access to (e.g. ['repo']). This array is
 * memoized, so it's not necessary to do this by the caller.
 *
 * @returns AsyncState<@octokit/graphql>
 */
export function useOctokitGraphql(hostname: string, scopes: string[]) {
  const githubOctokitApi = useApi(githubOctokitApiRef);

  const authScopes = useMemoizedScopes(scopes);

  return useAsync(
    () => githubOctokitApi.getGraphql(hostname, authScopes),
    [githubOctokitApi, hostname, authScopes],
  );
}

/**
 * Get an @octokit/graphql instance for the provided entity.
 *
 * Specify which scopes you need access to (e.g. ['repo']). This array is
 * memoized, so it's not necessary to do this by the caller.
 *
 * Also return the {owner/repo} parts of the entity source url.
 *
 * @returns AsyncState<@octokit/graphql & {owner: string; repo: string;}>
 */
export function useOctokitGraphqlForCustomEntity(
  entity: Entity,
  scopes: string[],
) {
  const githubOctokitApi = useApi(githubOctokitApiRef);

  const authScopes = useMemoizedScopes(scopes);

  return useAsync(
    () => githubOctokitApi.getGraphqlForEntity(entity, authScopes),
    [githubOctokitApi, entity, authScopes],
  );
}

/**
 * Get an @octokit/graphql instance for the current entity.
 *
 * Specify which scopes you need access to (e.g. ['repo']). This array is
 * memoized, so it's not necessary to do this by the caller.
 *
 * Also return the {owner/repo} parts of the entity source url.
 *
 * @returns AsyncState<@octokit/graphql & {owner: string; repo: string;}>
 */
export function useOctokitGraphqlForEntity(scopes: string[]) {
  const { entity, loading, error } = useEntity();

  const githubOctokitApi = useApi(githubOctokitApiRef);

  const authScopes = useMemoizedScopes(scopes);

  const asyncState = useAsync(
    () => githubOctokitApi.getGraphqlForEntity(entity, authScopes),
    [githubOctokitApi, entity, authScopes],
  );

  if (loading || asyncState.loading) {
    return { loading: true } as const;
  }
  if (error || asyncState.error) {
    return { error: error ?? asyncState.error! };
  }

  return { loading: false, error: undefined, value: asyncState.value! };
}
