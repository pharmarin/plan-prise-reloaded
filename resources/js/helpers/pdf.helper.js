import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs
/*pdfMake.fonts = {
  Nunito: {
    normal: 'Nunito-Regular.ttf',
    bold: 'Nunito-Medium.ttf',
    italics: 'Nunito-Regular.ttf',
    bolditalics: 'Nunito-Medium.ttf'
  }
}*/

let pageMargins = 20

export const generate = (pp_id, columns, values) => {
  let document = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [pageMargins, pageMargins * 2.5],
    header: {
      stack: [
        { text: 'Un plan pour vous aider à mieux prendre vos médicaments', style: 'header' },
        { text: 'Ceci n\'est pas une ordonnance', style: 'header' }
      ],
      margin: [pageMargins, pageMargins]
    },
    footer: (currentPage, pageCount) => ({
      columns: [
        { text: 'Édité par ' + window.php.user.name, style: 'footer' },
        { text: 'Plan de prise n°' + pp_id, alignment: 'center', style: 'footer' },
        { text: 'Page ' + currentPage.toString() + ' sur ' + pageCount, alignment: 'right', style: 'footer' }
      ],
      margin: [pageMargins, pageMargins]
    }),
    content: [{
      table: {
        layout: 'planPrise',
        headerRows: 1,
        dontBreakRows: true,
        body: [
          [...columns.map(column => ({
            text: column.header,
            alignment: _.startsWith(column.id, 'poso_') ? 'center' : 'left', style: ['tableHeader', column.id]
          }))],
          ...values.map(line => [...columns.map(column => _.get(line, column.id, { text: " ", style: column.id }))])
        ],
        widths: columns.map(column => _.startsWith(column.id, 'poso_') ? 40 : 'auto'),
      }
    }],
    defaultStyle: {
      fontSize: 10,
      fillOpacity: .5
    },
    styles: {
      header: {
        bold: true,
        color: 'gray',
        fontSize: 9,
      },
      get footer() {
        return this.header
      },
      tableHeader: {
        bold: true,
        fillOpacity: 1
      },
      interline: {
        fontSize: 2
      },
      custom_denomination: {
        bold: true
      },
      compositions: {
        italics: true,
        color: 'gray'
      },
      voies_administration: {
        fontSize: 9,
        color: 'gray'
      },
      ..._.fromPairs(
        _.filter(columns, col => _.startsWith(col.id, 'poso_')).map(poso => {
          return [
            poso.id,
            {
              alignment: 'center',
              fillColor: poso.color
            }
          ]
        })
      )
    }
  }
  pdfMake.createPdf(document).open()
}
