import useAxios from 'axios-hooks';
import Dropdown from 'components/Dropdown';
import Chevron from 'components/Icons/Chevron';
import Search from 'components/Icons/Search';
import Input from 'components/Input';
import Pagination from 'components/Pagination';
import Spinner from 'components/Spinner';
import Table from 'components/Table';
import { requestUrl } from 'helpers/hooks/use-json-api';
import { debounce } from 'lodash';
import React, { useState } from 'react';

const AsyncTable: React.FC<
  {
    columns: { id: string; label: string }[];
    extractData: (
      filter: React.ReactText,
      columnId: string,
      data: any,
      forceReload?: any
    ) => string | React.ReactElement;
    filters?: {
      [key: string]: {
        label: string;
        filter?: { field: string; value: string };
      };
    };
    include?: string[];
    /**
     * URL of the link wrapping table cell
     * Must contain "ID" which will be replaced by the id of the row element
     */
    linkTo?: string;
    sortBy?: string;
    searchKey?: string;
    type: string;
  } & React.ComponentPropsWithoutRef<'div'>
> = ({
  columns,
  extractData,
  filters = {},
  include,
  linkTo,
  searchKey,
  sortBy,
  type,
  ...props
}) => {
  const [filter, setFilter] = useState<keyof typeof filters>(
    Object.keys(filters)[0]
  );

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const setSearchDebounced = debounce(
    (query: string) => setSearch(query),
    1000
  );

  const [{ data, error, loading }, reload] = useAxios<
    IServerResponse<Models.App.User[]>
  >({
    url: requestUrl(type, {
      filter:
        searchKey && search.length > 0
          ? {
              field: searchKey,
              value: `${search}`,
            }
          : filters[filter]?.filter,
      page,
      sort: sortBy,
    }).url,
  });

  return (
    <div {...props}>
      <div className="mb-6 flex justify-between items-center">
        {searchKey && (
          <div className="flex-1 pr-4">
            <div className="relative md:w-1/3">
              <Input
                className="w-full pl-10 pr-4 py-2 rounded-lg shadow-md focus:outline-none focus:shadow-outline text-gray-600 font-medium border-transparent!"
                name="search"
                type="search"
                placeholder="Rechercher..."
                onChange={(event) => {
                  event.target.value.length > 0
                    ? setSearchDebounced(event.target.value)
                    : setSearch('');
                }}
              />
              <div className="absolute top-0 left-0 inline-flex items-center p-2">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>
        )}

        {Object.keys(filters).length > 0 && (
          <div>
            <Dropdown
              buttonContent={
                <span className="flex align-middle">
                  {filters[filter]?.label}
                  <Chevron.Single.Down.Small className="ml-1 mt-1 h-4 w-4" />
                </span>
              }
              buttonProps={{
                className:
                  'py-2 px-3 bg-white shadow-md rounded-lg text-gray-600 font-medium',
              }}
              items={Object.keys(filters).map((key) => ({
                label: filters[key].label,
                action: () => setFilter(key),
              }))}
            />
          </div>
        )}
      </div>

      <Table className="text-center" stripped>
        <Table.Head>
          <Table.Row>
            {columns.map((column) => (
              <Table.HeadCell key={column.id}>{column.label}</Table.HeadCell>
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {loading || error ? (
            loading ? (
              <Table.Row>
                <Table.Cell colSpan={columns.length}>
                  <div className="flex align-middle justify-center text-gray-600">
                    <Spinner />
                    <span className="ml-4">Chargement en cours...</span>
                  </div>
                </Table.Cell>
              </Table.Row>
            ) : (
              <Table.Row>
                <Table.Cell colSpan={columns.length}>
                  <div className="text-center text-red-600">
                    Une erreur est survenue pendant le chargement
                  </div>
                </Table.Cell>
              </Table.Row>
            )
          ) : (
            (data?.data || []).map((row) => (
              <Table.Row key={row.id || ''} hover={linkTo !== undefined}>
                {columns.map((column) =>
                  linkTo ? (
                    <Table.CellWithLink
                      key={column.id}
                      to={linkTo.replace('ID', row.id || '')}
                    >
                      {extractData(filter, column.id, row, reload)}
                    </Table.CellWithLink>
                  ) : (
                    <Table.Cell key={column.id}>
                      {extractData(filter, column.id, row, reload)}
                    </Table.Cell>
                  )
                )}
              </Table.Row>
            ))
          )}
        </Table.Body>
        {data && (
          <Table.Footer>
            <Table.Row>
              <Table.Cell colSpan={columns.length}>
                <Pagination
                  setPage={(pageNumber) => setPage(pageNumber)}
                  //{...model.getPagination(data)}
                />
              </Table.Cell>
            </Table.Row>
          </Table.Footer>
        )}
      </Table>
    </div>
  );
};

export default AsyncTable;
