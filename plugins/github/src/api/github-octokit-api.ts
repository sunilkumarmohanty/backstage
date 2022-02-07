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

import type { Octokit } from '@octokit/rest';
import type { graphql } from '@octokit/graphql';

import { Entity } from '@backstage/catalog-model';

import { OwnerRepo } from '../utils/types';

export type OctokitRestWithOwnerRepo = { octokit: Octokit } & OwnerRepo;
export type OctokitGraphqlWithOwnerRepo = {
  octokit: typeof graphql;
} & OwnerRepo;

export type GithubOctokitApi = {
  /**
   * Get an Octokit REST instance given the hostname to GitHub (or an
   * enterprise GitHub installation)
   *
   * Specify which scopes you need access to (e.g. ['repo'])..
   */
  getRest(hostname: string | URL, scopes: string[]): Promise<Octokit>;

  /**
   * Get an Octokit REST instance given an entity's source url.
   *
   * Specify which scopes you need access to (e.g. ['repo'])..
   *
   * Also returns the {owner/repo} parts of the entity source url.
   */
  getRestForEntity(
    entity: Entity,
    scopes: string[],
  ): Promise<OctokitRestWithOwnerRepo>;

  /**
   * Get an Octokit GraphQL instance given the hostname to GitHub (or an
   * enterprise GitHub installation)
   *
   * Specify which scopes you need access to (e.g. ['repo'])..
   */
  getGraphql(hostname: string | URL, scopes: string[]): Promise<typeof graphql>;

  /**
   * Get an Octokit GraphQL instance given entity's source url.
   *
   * Specify which scopes you need access to (e.g. ['repo'])..
   *
   * Also returns the {owner/repo} parts of the entity source url.
   */
  getGraphqlForEntity(
    entity: Entity,
    scopes: string[],
  ): Promise<OctokitGraphqlWithOwnerRepo>;
};
