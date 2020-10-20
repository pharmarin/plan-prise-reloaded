import React, { useEffect, useState } from 'react';
import useAxios from 'axios-hooks';
import MedicamentTable from './MedicamentTable';
import MedicamentPagination from './MedicamentTable/MedicamentPagination';
import MedicamentEdit from './MedicamentEdit';
import { get, merge } from 'lodash';
import useJsonApi from 'helpers/hooks/use-json-api';
import SplashScreen from 'components/App/SplashScreen';
import { connect, ConnectedProps } from 'react-redux';
import { updateAppNav } from 'store/app';
import { useParams } from 'react-router-dom';

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

  const currentUrl = requestUrl('medicament', {
    page,
    sort: 'denomination',
    include: ['composition', 'precautions'],
  });

  const [{ data, loading, error }, execute] = useAxios<
    IServerResponse<IModels.Medicament>
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
    const medicament = extractOne({ id: String(editing), type: 'medicament' });
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
