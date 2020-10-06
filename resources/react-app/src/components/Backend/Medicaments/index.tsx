import React, { useEffect, useState } from 'react';
import useAxios from 'axios-hooks';
import MedicamentTable from './MedicamentTable';
import MedicamentPagination from './MedicamentTable/MedicamentPagination';

export default () => {
  const [page, setPage] = useState(1);
  const [prevPage, setPrevPage] = useState<number | null>(null);
  const [last, setLast] = useState<number | null>(null);
  const [dataPerPage, setDataPerPage] = useState<{
    pages: { [page: number]: IModels.Medicament[] };
    search: { [query: string]: IModels.Medicament[] };
  }>({ pages: {}, search: {} });

  const [{ data, loading, error }, execute] = useAxios<
    IServerResponse<IModels.Medicament[]>
  >(
    {
      url: '/medicament',
      params: { 'page[number]': page, sort: 'denomination' },
    },
    { manual: true }
  );

  useEffect(() => {
    if (dataPerPage.pages[page] === undefined) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    setDataPerPage((d) =>
      data
        ? { pages: { ...d.pages, [page]: data.data }, search: { ...d.search } }
        : d
    );
    setPrevPage(null);
    if (data && !last) {
      setLast(data.meta.page['last-page']);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (error) {
    throw new Error(
      'Une erreur est survenue lors du chargement des médicaments. '
    );
  }

  return (
    <div>
      <MedicamentTable data={dataPerPage.pages[prevPage ? prevPage : page]} />
      {last && (
        <MedicamentPagination
          last={last}
          loading={loading}
          page={page}
          prevPage={prevPage}
          setPages={(page, prev) => {
            setPage(page);
            setPrevPage(prev);
          }}
        />
      )}
    </div>
  );
};
