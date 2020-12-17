import Button from 'components/Button';
import Chevron from 'components/Icons/Chevron';
import React from 'react';

const Pagination: React.FC<{
  currentPage?: number;
  from?: number;
  lastPage?: number;
  perPage?: number;
  setPage: (pageNumber: number) => void;
  to?: number;
  total?: number;
}> = ({ currentPage, from, lastPage, perPage, setPage, to, total }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 flex justify-between sm:hidden">
        <Button
          color="link"
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"
        >
          Précédent
        </Button>
        <Button
          color="link"
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"
        >
          Suivant
        </Button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        {from && to && total && (
          <div>
            <p className="text-sm text-gray-700">
              Affichage de <span className="font-medium">{from}</span> à{' '}
              <span className="font-medium">{to}</span> sur{' '}
              <span className="font-medium">{total}</span> resultats
            </p>
          </div>
        )}
        {currentPage && lastPage && (
          <div>
            <nav
              className="relative z-0 inline-flex shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <Button
                color="link"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                disabled={currentPage === 1}
                onClick={() =>
                  currentPage > 1 ? setPage(currentPage - 1) : null
                }
                unstyled
              >
                <span className="sr-only">Précédent</span>
                <Chevron.Single.Left.Small />
              </Button>
              <Button
                color="link"
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={() => setPage(1)}
                unstyled
              >
                <Chevron.Double.Left.Small />
              </Button>
              {[3, 2, 1].map((key) =>
                currentPage - key > 1 && currentPage - key < lastPage ? (
                  <Button
                    key={`end_${key}`}
                    color="link"
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setPage(currentPage - key)}
                    unstyled
                  >
                    {currentPage - key}
                  </Button>
                ) : undefined
              )}
              <select
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                onChange={(e) => setPage(Number(e.target.value))}
              >
                {[
                  ...Array(Math.floor((lastPage - 10) / 10) + 1)
                    .fill(0)
                    .map((_, idx) => 10 + idx * 10),
                  currentPage,
                ]
                  .sort((a, b) => a - b)
                  .map((page) => (
                    <option selected={page === currentPage} value={page}>
                      {page}
                    </option>
                  ))}
              </select>
              {[1, 2, 3].map((key) =>
                currentPage + key > 1 && currentPage + key < lastPage ? (
                  <Button
                    key={`start_${key}`}
                    color="link"
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setPage(currentPage + key)}
                    unstyled
                  >
                    {currentPage + key}
                  </Button>
                ) : undefined
              )}
              <Button
                color="link"
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={() => setPage(lastPage)}
                unstyled
              >
                <Chevron.Double.Right.Small />
              </Button>
              <Button
                color="link"
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                disabled={currentPage === lastPage}
                onClick={() =>
                  currentPage < lastPage ? setPage(currentPage + 1) : null
                }
                unstyled
              >
                <span className="sr-only">Suivant</span>
                <Chevron.Single.Right.Small />
              </Button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;
