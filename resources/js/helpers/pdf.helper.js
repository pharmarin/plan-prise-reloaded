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
        body: [
          [...columns.map(column => ({ text: column.header, alignment: _.startsWith(column.id, 'poso_') ? 'center' : 'left', style: 'tableHeader' }))],
          ...values.map(line => [...columns.map(column => {
            console.log(_.get(line, column.id, ""))
            return _.get(line, column.id, "")
          })])
        ],
        widths: columns.map(column => _.startsWith(column.id, 'poso_') ? 40 : 'auto'),
      }
    }],
    defaultStyle: {
      fontSize: 10,
      //font: 'Nunito',
      lineHeight: 1.2
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
      poso: {
        alignment: 'center'
      },
      get poso_matin() { return this.poso },
      get poso_10h() { return this.poso },
      get poso_midi() { return this.poso },
      get poso_16h() { return this.poso },
      get poso_soir() { return this.poso },
      get poso_coucher() { return this.poso }
    }
  }
  pdfMake.createPdf(document).open()
}
