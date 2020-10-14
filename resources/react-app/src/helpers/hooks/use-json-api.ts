import normalize from 'json-api-normalizer';
import { cloneDeep, get, keys } from 'lodash';
import { useState } from 'react';

export default () => {
  const [cache, setCache] = useState<{
    medicament?: {};
    meta?: {
      [type: string]: {
        [pagination: string]: {
          data: {
            id: string;
            type: string;
          }[];
        };
      };
    };
    precaution?: {};
    principeActif?: {};
  }>();

  const sync = (c: any) => setCache(c);

  const extractOne = (identifier: { id: string; type: string }) => {
    if (!identifier) return null;

    const entity = cloneDeep(get(cache, `${identifier.type}.${identifier.id}`));

    if (!entity) return null;

    let { attributes, relationships, ...meta } = entity;

    if (relationships) {
      (keys(relationships) || []).map(
        (k: string) =>
          (relationships[k] = (
            relationships[k].data || []
          ).map((relatedIdentifier: { id: string; type: string }) =>
            extractOne(relatedIdentifier)
          ))
      );
    }

    return {
      ...meta,
      ...attributes,
      ...relationships,
    };
  };

  const extractMany = (identifiers: { id: string; type: string }[]) => {
    if (!identifiers) return [];

    return identifiers.map((i) => extractOne(i));
  };

  return {
    extractOne,
    extractMany,
    normalize,
    sync,
  };
};
