import React from 'react';
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  Spinner,
} from 'reactstrap';

export default ({
  last,
  loading,
  page,
  prevPage,
  setPages,
}: IProps.Backend.MedicamentPagination) => {
  return (
    <Pagination className="mx-auto">
      <PaginationItem disabled={page === 1}>
        <PaginationLink first onClick={() => setPages(1, page)} />
      </PaginationItem>
      <PaginationItem disabled={page === 1}>
        <PaginationLink previous onClick={() => setPages(page - 1, page)} />
      </PaginationItem>
      {[
        ...[1, 2, 3, 4]
          .map((_, i) => page - (i + 1))
          .filter((n) => n > 0)
          .sort(),
        page,
        ...[1, 2, 3, 4]
          .map((_, i) => page + (i + 1))
          .filter((n) => n < (last || 0) + 1)
          .sort(),
      ].map((p) => (
        <PaginationItem key={p} active={prevPage ? p === prevPage : p === page}>
          <PaginationLink onClick={() => setPages(p, page)}>
            {p === page && loading ? <Spinner size="sm" /> : p}
          </PaginationLink>
        </PaginationItem>
      ))}
      <PaginationItem>
        <PaginationLink next onClick={() => setPages(page + 1, page)} />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink last onClick={() => setPages(last || 1, page)} />
      </PaginationItem>
    </Pagination>
  );
};
