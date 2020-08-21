import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import filter from 'lodash/filter';
import fromPairs from 'lodash/fromPairs';
import map from 'lodash/map';
import get from 'lodash/get';
import startsWith from 'lodash/startsWith';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const pageMargins = 20;

export default function generate(ppId, columns, values) {
  const document = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [pageMargins, pageMargins * 2.5],
    header: {
      stack: [
        {
          text: 'Un plan pour vous aider à mieux prendre vos médicaments',
          style: 'header',
        },
        { text: "Ceci n'est pas une ordonnance", style: 'header' },
      ],
      margin: [pageMargins, pageMargins],
    },
    footer: (currentPage, pageCount) => ({
      columns: [
        {
          text: `Édité par ${window.php.user.name}`,
          style: 'footer',
        },
        {
          text: `Plan de prise n°${ppId}`,
          alignment: 'center',
          style: 'footer',
        },
        {
          text: `Page ${currentPage.toString()} sur ${pageCount}`,
          alignment: 'right',
          style: 'footer',
        },
      ],
      margin: [pageMargins, pageMargins],
    }),
    content: [
      {
        table: {
          layout: 'planPrise',
          headerRows: 1,
          dontBreakRows: true,
          body: [
            [
              ...map(columns, (column) => ({
                text: column.header,
                alignment: startsWith(column.id, 'poso_') ? 'center' : 'left',
                style: ['tableHeader', column.id],
              })),
            ],
            ...map(values, (line) => [
              ...map(columns, (column) =>
                get(line, column.id, {
                  text: ' ',
                  style: column.id,
                })
              ),
            ]),
          ],
          widths: map(columns, (column) =>
            startsWith(column.id, 'poso_') ? 40 : 'auto'
          ),
        },
      },
    ],
    defaultStyle: {
      fontSize: 10,
      fillOpacity: 0.5,
    },
    styles: {
      header: {
        bold: true,
        color: 'gray',
        fontSize: 9,
      },
      get footer() {
        return this.header;
      },
      tableHeader: {
        bold: true,
        fillOpacity: 1,
      },
      interline: {
        fontSize: 2,
      },
      denomination: {
        bold: true,
      },
      compositions: {
        italics: true,
        color: 'gray',
      },
      voies_administration: {
        fontSize: 9,
        color: 'gray',
      },
      ...fromPairs(
        filter(columns, (col) =>
          map(startsWith(col.id, 'poso_'), (poso) => {
            return [
              poso.id,
              {
                alignment: 'center',
                fillColor: poso.color,
              },
            ];
          })
        )
      ),
    },
  };
  pdfMake.createPdf(document).open();
}
