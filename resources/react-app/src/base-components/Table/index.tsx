import classNames from 'classnames';
import React from 'react';

const TableBody: React.FC = ({ children }) => {
  return <tbody>{children}</tbody>;
};

const TableCell: React.FC = ({ children }) => {
  return (
    <td className="border-dashed border-t border-gray-200 text-gray-700 px-6 py-3">
      {children}
    </td>
  );
};

const TableHead: React.FC = ({ children }) => {
  return <thead>{children}</thead>;
};

const TableHeadCell: React.FC<{ className?: string }> = ({
  children,
  className,
}) => {
  return (
    <th
      className={classNames(
        'bg-gray-200 sticky top-0 border-b border-gray-300 px-6 py-3 text-gray-600 font-bold tracking-wider uppercase text-xs first:rounded-tl-lg last:rounded-tr-lg',
        className
      )}
    >
      {children}
    </th>
  );
};

const TableRow: React.FC = ({ children }) => {
  return <tr>{children}</tr>;
};

const Table: React.FC<{ stripped?: boolean }> & {
  Body: typeof TableBody;
  Cell: typeof TableCell;
  Head: typeof TableHead;
  HeadCell: typeof TableHeadCell;
  Row: typeof TableRow;
} = ({ children, stripped }) => {
  return (
    <table
      className={classNames(
        'bg-white rounded-lg shadow-md overflow-y-auto border-collapse table-auto w-full whitespace-no-wrap relative',
        { 'table-striped': stripped }
      )}
    >
      {children}
    </table>
  );
};

Table.Body = TableBody;
Table.Cell = TableCell;
Table.Head = TableHead;
Table.HeadCell = TableHeadCell;
Table.Row = TableRow;

export default Table;
