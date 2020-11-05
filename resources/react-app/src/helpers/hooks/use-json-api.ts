import normalize from 'json-api-normalizer';
import { cloneDeep, get, keys, values } from 'lodash';
import { useState } from 'react';

export const requestUrl = (
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

export const normalizeOne = (
  identifier: { id: string; type: string },
  response: any
) => {
  const normalized = normalize(response, {
    camelizeKeys: false,
    camelizeTypeValues: false,
  });

  return extractOne(identifier, normalized);
};

export const extractOne = (
  identifier: { id: string; type: string },
  cacheOverride: any
) => {
  if (!identifier) return null;

  const entity = cloneDeep(
    get(cacheOverride, `${identifier.type}.${identifier.id}`)
  );

  if (!entity) return null;

  let { attributes, relationships, ...meta } = entity;

  if (relationships) {
    (keys(relationships) || []).forEach(
      (k: string) =>
        (relationships[k] = (
          relationships[k].data || []
        ).map((relatedIdentifier: IModels.MedicamentIdentity) =>
          extractOne(
            { id: relatedIdentifier.id, type: relatedIdentifier.type },
            cacheOverride
          )
        ))
    );
  }

  return {
    ...meta,
    ...attributes,
    ...relationships,
  };
};

const extractMany = (
  identifiers: { id: string; type: string }[],
  cacheOverride: any
) => {
  if (!identifiers) return [];

  return identifiers.map((i) => extractOne(i, cacheOverride));
};

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
    precautions?: {};
    principeActif?: {};
  }>();

  const sync = (c: any) => setCache(c);

  return {
    extractOne: (identifier: { id: string; type: string }) =>
      extractOne(identifier, cache),
    extractMany: (identifiers: { id: string; type: string }[]) =>
      extractMany(identifiers, cache),
    normalize,
    normalizeOne,
    requestUrl,
    sync,
  };
};
