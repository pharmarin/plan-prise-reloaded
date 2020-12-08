import React from 'react';
import joinClassNames from 'utility/class-names';

const TableBody: React.FC = ({ children }) => {
  return <tbody>{children}</tbody>;
};

const TableCell: React.FC<React.ComponentPropsWithoutRef<'td'>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <td
      className={joinClassNames(
        'border-dashed border-t border-gray-200 text-gray-700 px-6 py-3',
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
};

const TableHead: React.FC<React.ComponentPropsWithoutRef<'thead'>> = ({
  children,
  ...props
}) => {
  return <thead {...props}>{children}</thead>;
};

const TableHeadCell: React.FC<React.ComponentPropsWithoutRef<'th'>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <th
      className={joinClassNames(
        'bg-gray-200 sticky top-0 border-b border-gray-300 px-6 py-3 text-gray-600 font-bold tracking-wider uppercase text-xs first:rounded-tl-lg last:rounded-tr-lg',
        className
      )}
      {...props}
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
      className={joinClassNames(
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
