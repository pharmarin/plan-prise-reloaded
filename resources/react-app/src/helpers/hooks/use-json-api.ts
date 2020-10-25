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
      id?: string;
      page?: number;
      sort?: string;
      include?: string[];
      fields?: { [type: string]: string[] };
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
      ...(query && query.fields
        ? {
            fields: keys(query.fields)
              .map(
                (type) =>
                  `fields[${type}]=${(query.fields![type] || []).join(',')}`
              )
              .join('&'),
          }
        : {}),
      ...(query && query.filter
        ? { filter: `filter[${query.filter.field}]=${query.filter.value}` }
        : {}),
    };
    return {
      url: `${base}${query && query.id ? `/${query.id}` : ''}${
        keys(params).length > 0 ? '?' + values(params).join('&') : ''
      }`,
      base,
      ...params,
    };
  };

  const sync = (c: any) => setCache(c);

  const extractOne = (
    identifier: { id: string; type: string },
    cacheOverride?: any
  ) => {
    if (!identifier) return null;

    const usedCache = cacheOverride ? cacheOverride : cache;

    const entity = cloneDeep(
      get(usedCache, `${identifier.type}.${identifier.id}`)
    );

    if (!entity) return null;

    let { attributes, relationships, ...meta } = entity;

    if (relationships) {
      (keys(relationships) || []).map(
        (k: string) =>
          (relationships[k] = (
            relationships[k].data || []
          ).map((relatedIdentifier: { id: string; type: string }) =>
            extractOne(relatedIdentifier, cacheOverride)
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

  const normalizeOne = (
    identifier: { id: string; type: string },
    response: any
  ) => {
    const normalized = normalize(response, {
      camelizeKeys: false,
      camelizeTypeValues: false,
    });

    return extractOne(identifier, normalized);
  };

  return {
    extractOne,
    extractMany,
    normalize,
    normalizeOne,
    requestUrl,
    sync,
  };
};
