import useAxios from 'axios-hooks';
import SplashScreen from 'containers/App/SplashScreen';
import useJsonApi from 'helpers/hooks/use-json-api';
import { get, merge } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updateAppNav } from 'store/app';
import MedicamentEdit from './MedicamentEdit';
import MedicamentTable from './MedicamentTable';
import MedicamentPagination from './MedicamentTable/MedicamentPagination';

const mapDispatch = {
  updateAppNav,
};

const connector = connect(null, mapDispatch);

type MedicamentsBackendProps = ConnectedProps<typeof connector>;

const MedicamentsBackend = ({ updateAppNav }: MedicamentsBackendProps) => {
  const { id, edit } = useParams<{ id?: string; edit?: 'edit' }>();
  const { extractOne, extractMany, normalize, requestUrl, sync } = useJsonApi();
  const [page, setPage] = useState(1);
  const [prevPage, setPrevPage] = useState<number | null>(null);
  const [last, setLast] = useState<number | null>(null);
  const [cache, setCache] = useState<{
    medicaments?: {};
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
    principeActifs?: {};
  }>({});
  const editing = edit === 'edit' ? id : undefined;

  useEffect(() => {
    if (!editing) {
      updateAppNav({
        title: `Médicaments`,
        returnTo: {
          path: '/admin',
          label: 'arrow-left',
        },
      });
    }
    // if editing, updateAppNav append in MedicamentEdit component
  });

  const currentUrl = requestUrl('medicaments', {
    page,
    sort: 'denomination',
    include: ['composition', 'precautions'],
    fields: {
      medicaments: ['denomination', 'composition', 'precautions'],
    },
  });

  const [{ data, loading, error }, execute] = useAxios<
    IServerResponse<
      Pick<
        Models.Medicament.Extracted,
        'id' | 'denomination' | 'precautions' | 'type'
      >
    >
  >(
    {
      url: currentUrl.url,
    },
    { manual: true }
  );

  useEffect(() => {
    if (
      get(cache, `meta.${currentUrl.base}.?${currentUrl.page}`) === undefined
    ) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (data) {
      const normalized = merge(
        cache,
        normalize(data, {
          camelizeKeys: false,
          camelizeTypeValues: false,
          endpoint: `${currentUrl.base}?${currentUrl.page}`,
          filterEndpoint: false,
        })
      );
      setCache(normalized);
      sync(normalized);
      setPrevPage(null);
      if (!last) {
        setLast(data.meta.page['last-page']);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (error) {
    throw new Error(
      'Une erreur est survenue lors du chargement des médicaments. '
    );
  }

  if (!cache || !cache.meta) {
    return <SplashScreen type="load" message="Chargement des médicaments" />;
  }

  const dataSet = get(cache, [
    'meta',
    currentUrl.base,
    `?page[number]=${prevPage || page}`,
    'data',
  ]);

  if (editing) {
    const medicament = extractOne({ id: String(editing), type: 'medicaments' });
    if (!medicament) throw new Error('Aucun médicament à modifier');
    // error quand modifie charge page puis modifie médicament
    return <MedicamentEdit medicament={medicament} />;
  }

  return (
    <div>
      <MedicamentTable data={extractMany(dataSet)} />
      {last && (
        <MedicamentPagination
          last={last}
          loading={loading}
          page={page}
          prevPage={prevPage}
          setPages={(page: number, prev: number) => {
            setPage(page);
            setPrevPage(prev);
          }}
        />
      )}
    </div>
  );
};

export default connector(MedicamentsBackend);
