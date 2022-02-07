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
  ReactNode,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react';
import { useOutlet } from 'react-router';
import { useParams } from 'react-router-dom';
import { useAsync } from 'react-use';

import { EntityName } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { Page } from '@backstage/core-components';
import { techDocsPage } from '@backstage/plugin-techdocs-mkdocs';

import { techdocsApiRef } from '../../../api';
import { TechDocsNotFound } from '../TechDocsNotFound';
import { TechDocsPageLayout } from '../TechDocsPageLayout';
import { TechDocsEntityMetadata, TechDocsMetadata } from '../../../types';

export type TechDocsPageRenderFunction = ({
  techdocsMetadataValue,
  entityMetadataValue,
  entityRef,
}: {
  techdocsMetadataValue?: TechDocsMetadata | undefined;
  entityMetadataValue?: TechDocsEntityMetadata | undefined;
  entityRef: EntityName;
  isReady: boolean;
  onReady: () => void;
}) => JSX.Element;

type TechDocsPageValue = {
  techdocsMetadataValue?: TechDocsMetadata | undefined;
  entityMetadataValue?: TechDocsEntityMetadata | undefined;
  entityRef: EntityName;
  isReady: boolean;
  onReady: () => void;
};

const TechDocsPageContext = createContext<TechDocsPageValue>({
  entityRef: { kind: '', namespace: '', name: '' },
  isReady: false,
  onReady: () => {},
});

const TechDocsPageProvider = ({ children }: PropsWithChildren<{}>) => {
  const { namespace, kind, name } = useParams();
  const [isReady, setReady] = useState<boolean>(false);

  const techdocsApi = useApi(techdocsApiRef);

  const { value: techdocsMetadataValue } = useAsync(async () => {
    if (isReady) {
      return await techdocsApi.getTechDocsMetadata({ kind, namespace, name });
    }
    return undefined;
  }, [kind, namespace, name, isReady, techdocsApi]);

  const { value: entityMetadataValue, error: entityMetadataError } =
    useAsync(async () => {
      return await techdocsApi.getEntityMetadata({ kind, namespace, name });
    }, [kind, namespace, name, techdocsApi]);

  const onReady = useCallback(() => {
    setReady(true);
  }, [setReady]);

  const value = {
    entityRef: { namespace, kind, name },
    entityMetadataValue,
    techdocsMetadataValue,
    isReady,
    onReady,
  };

  if (entityMetadataError) {
    return <TechDocsNotFound errorMessage={entityMetadataError.message} />;
  }

  return (
    <TechDocsPageContext.Provider value={value}>
      {children instanceof Function ? children(value) : children}
    </TechDocsPageContext.Provider>
  );
};

export const useTechDocsPage = () => useContext(TechDocsPageContext);

export type TechDocsPageProps = {
  children?: TechDocsPageRenderFunction | ReactNode;
};

export const TechDocsPage = ({ children }: TechDocsPageProps) => {
  const outlet = useOutlet();

  if (!children) {
    return (
      <TechDocsPageProvider>
        <TechDocsPageLayout>{outlet || techDocsPage}</TechDocsPageLayout>
      </TechDocsPageProvider>
    );
  }

  return (
    <Page themeId="documentation">
      <TechDocsPageProvider>{children}</TechDocsPageProvider>
    </Page>
  );
};
