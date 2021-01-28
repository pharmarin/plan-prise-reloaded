import React from 'react';
import { Link } from 'react-router-dom';
import joinClassNames from 'tools/class-names';

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

const TableCellWithLink: React.FC<
  React.ComponentPropsWithoutRef<'td'> & { to: string }
> = ({ children, className, to, ...props }) => {
  return (
    <td
      className={joinClassNames(
        'border-dashed border-t border-gray-200',
        className
      )}
      {...props}
    >
      <Link to={to} className={'px-6 py-3 flex justify-center text-gray-700'}>
        {children}
      </Link>
    </td>
  );
};

const TableFooter: React.FC<React.ComponentPropsWithoutRef<'tfoot'>> = ({
  children,
  className,
}) => {
  return (
    <tfoot className={joinClassNames('border-solid border-t', className)}>
      {children}
    </tfoot>
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

const TableRow: React.FC<
  React.ComponentPropsWithoutRef<'tr'> & { hover?: boolean }
> = ({ children, className, hover, ...props }) => {
  return (
    <tr
      className={joinClassNames(
        {
          'hover:bg-gray-100': hover,
        },
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

const Table: React.FC<
  React.ComponentPropsWithoutRef<'table'> & { stripped?: boolean }
> & {
  Body: typeof TableBody;
  Cell: typeof TableCell;
  CellWithLink: typeof TableCellWithLink;
  Footer: typeof TableFooter;
  Head: typeof TableHead;
  HeadCell: typeof TableHeadCell;
  Row: typeof TableRow;
} = ({ children, className, stripped }) => {
  return (
    <table
      className={joinClassNames(
        'bg-white rounded-lg shadow-md overflow-y-auto border-collapse table-auto w-full whitespace-no-wrap relative',
        { 'table-striped': stripped },
        className
      )}
    >
      {children}
    </table>
  );
};

Table.Body = TableBody;
Table.Cell = TableCell;
Table.CellWithLink = TableCellWithLink;
Table.Footer = TableFooter;
Table.Head = TableHead;
Table.HeadCell = TableHeadCell;
Table.Row = TableRow;

export default Table;
