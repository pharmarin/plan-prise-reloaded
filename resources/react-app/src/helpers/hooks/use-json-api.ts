import normalize from 'json-api-normalizer';
import { cloneDeep, get, keys, values } from 'lodash';
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

  const requestUrl = (
    type: string,
    query?: {
      page?: number;
      sort?: string;
      include?: string[];
      filter?: { field: string; value: string };
    }
  ) => {
    const base = `/${type}`;
    let params = {
      ...(query && query.page ? { page: `page[number]=${query.page}` } : {}),
      ...(query && query.sort ? { sort: `sort=${query.sort}` } : {}),
      ...(query && query.include
        ? { include: `include=${(query.include || []).join(',')}` }
        : {}),
      ...(query && query.filter
        ? { filter: `filter[${query.filter.field}]=${query.filter.value}` }
        : {}),
    };
    return {
      url: `${base}${
        keys(params).length > 0 ? '?' + values(params).join('&') : ''
      }`,
      base,
      ...params,
    };
  };

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
    requestUrl,
    sync,
  };
};
