import React, { useEffect, useState } from 'react';
import useAxios from 'axios-hooks';
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  Spinner,
} from 'reactstrap';
import MedicamentTable from './MedicamentTable';
import { get } from 'lodash';
import SplashScreen from 'components/App/SplashScreen';

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

  if (!last)
    return <SplashScreen type="load" message="Chargement des médicaments" />;

  return (
    <div>
      <MedicamentTable
        loading={loading}
        page={page}
        setPage={setPage}
        data={dataPerPage.pages[prevPage ? prevPage : page]}
      />
      {last && (
        <Pagination className="mx-auto">
          <PaginationItem disabled={page === 1}>
            <PaginationLink
              first
              onClick={() => {
                setPage(1);
                setPrevPage(page);
              }}
            />
          </PaginationItem>
          <PaginationItem disabled={page === 1}>
            <PaginationLink
              previous
              onClick={() => {
                setPage(page - 1);
                setPrevPage(page);
              }}
            />
          </PaginationItem>
          {[
            ...[1, 2, 3, 4]
              .map((_, i) => page - (i + 1))
              .filter((n) => n > 0)
              .sort(),
            page,
            ...[1, 2, 3, 4]
              .map((_, i) => page + (i + 1))
              .filter((n) => n < last + 1)
              .sort(),
          ].map((p) => (
            <PaginationItem
              key={p}
              active={prevPage ? p === prevPage : p === page}
            >
              <PaginationLink
                onClick={() => {
                  setPage(p);
                  setPrevPage(page);
                }}
              >
                {p === page && loading ? <Spinner size="sm" /> : p}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationLink
              next
              onClick={() => {
                setPage(page + 1);
                setPrevPage(page);
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              last
              onClick={() => {
                setPage(last);
                setPrevPage(page);
              }}
            />
          </PaginationItem>
        </Pagination>
      )}
    </div>
  );
};
