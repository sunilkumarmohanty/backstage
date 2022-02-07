/*
 * Copyright 2020 The Backstage Authors
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

import React, {
  Dispatch,
  SetStateAction,
  PropsWithChildren,
  ComponentType,
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react';

import { useParams } from 'react-router-dom';

import { makeStyles, Grid } from '@material-ui/core';

import { BackstageTheme } from '@backstage/theme';
import { EntityName } from '@backstage/catalog-model';

import { TechDocsSearch } from './TechDocsSearch';
import { TechDocsStatus } from './TechDocsStateIndicator';
import { useReaderState } from './useReaderState';

type Props = PropsWithChildren<{
  entityRef: EntityName;
  withSearch?: boolean;
  isReady?: boolean;
  onReady?: () => void;
}>;

const useStyles = makeStyles<BackstageTheme>(theme => ({
  searchBar: {
    marginLeft: '20rem',
    maxWidth: 'calc(100% - 20rem * 2 - 3rem)',
    marginTop: theme.spacing(1),
    '@media screen and (max-width: 76.1875em)': {
      marginLeft: '10rem',
      maxWidth: 'calc(100% - 10rem)',
    },
  },
}));

type TechDocsReaderValue = ReturnType<typeof useReaderState> & {
  entityName: EntityName;
  isReady?: boolean;
  setReady: () => void;
};

const TechDocsReaderContext = createContext<TechDocsReaderValue>(
  {} as TechDocsReaderValue,
);

export const TechDocsReaderProvider = ({
  children,
  entityName,
  isReady,
  onReady = () => {},
}: PropsWithChildren<{
  entityName: EntityName;
  isReady?: boolean;
  onReady?: () => void;
}>) => {
  const { '*': path } = useParams();
  const { kind, namespace, name } = entityName;
  const state = useReaderState(kind, namespace, name, path);

  return (
    <TechDocsReaderContext.Provider
      value={{ ...state, entityName, isReady, setReady: onReady }}
    >
      {children}
    </TechDocsReaderContext.Provider>
  );
};

/**
 * Note: this HOC is currently being exported so that we can rapidly
 * iterate on alternative <Reader /> implementations that extend core
 * functionality. There is no guarantee that this HOC will continue to be
 * exported by the package in the future!
 *
 * todo: Make public or stop exporting (ctrl+f "altReaderExperiments")
 * @internal
 */
export const withTechDocsReaderProvider =
  <T extends {}>(
    Component: ComponentType<T>,
    entityName: EntityName,
    isReady?: boolean,
    onReady?: () => void,
  ) =>
  (props: T) =>
    (
      <TechDocsReaderProvider
        entityName={entityName}
        isReady={isReady}
        onReady={onReady}
      >
        <Component {...props} />
      </TechDocsReaderProvider>
    );

/**
 * Note: this hook is currently being exported so that we can rapidly
 * iterate on alternative <Reader /> implementations that extend core
 * functionality. There is no guarantee that this hook will continue to be
 * exported by the package in the future!
 *
 * todo: Make public or stop exporting (ctrl+f "altReaderExperiments")
 * @internal
 */

export const useTechDocsReader = () => useContext(TechDocsReaderContext);

const TechDocsReaderPage = ({
  withSearch = true,
  children,
}: Omit<Props, 'entityRef'>) => {
  const classes = useStyles();
  const { content, entityName, isReady } = useTechDocsReader();

  return (
    <Grid container>
      <Grid item xs={12}>
        <TechDocsStatus />
      </Grid>
      {!isReady && withSearch && (
        <Grid className={classes.searchBar} item xs={12}>
          <TechDocsSearch entityId={entityName} />
        </Grid>
      )}
      {content && (
        <Grid item xs={12}>
          {children}
        </Grid>
      )}
    </Grid>
  );
};

export const Reader = ({ entityRef, isReady, onReady, ...rest }: Props) => (
  <TechDocsReaderProvider
    entityName={entityRef}
    isReady={isReady}
    onReady={onReady}
  >
    <TechDocsReaderPage {...rest} />
  </TechDocsReaderProvider>
);
