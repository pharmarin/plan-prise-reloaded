import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {
  ContentStack,
  DynamicContent,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { isArray, map, startsWith } from 'lodash';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const pageMargins = 20;

const usePdf = ({ user }: { user: IModels.User | null }) => {
  const fromPlanPrise = (
    content: IPlanPriseRepository
  ): TDocumentDefinitions => {
    if (!content.data)
      throw new Error(
        "Impossible de créer un PDF si le plan de prise n'est pas chargé. "
      );

    const planPriseHeader: ContentStack = {
      stack: [
        {
          text: 'Un plan pour vous aider à mieux prendre vos médicaments',
          style: 'header',
        },
        { text: "Ceci n'est pas une ordonnance", style: 'header' },
      ],
      margin: [pageMargins, pageMargins],
    };

    const planPriseFooter = ({
      id,
      username,
    }: {
      id: number;
      username: string;
    }): DynamicContent => (currentPage, pageCount) => ({
      columns: [
        {
          text: `Édité par ${username}`,
          style: 'footer',
        },
        {
          text: `Plan de prise n°${id}`,
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
    });

    const planPriseColumns = (content: IMedicamentRepository[]) => [
      { id: 'informations', label: 'Médicament' },
      { id: 'conservation', label: 'Conservation' },
      ...map(content[0].attributes.posologies, (p) => ({
        id: p.id,
        label: p.label,
      })),
      { id: 'precautions', label: "Conseils d'utilisation" },
    ];

    if (!content) throw new Error('We need content to generate PDF');

    return {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [pageMargins, pageMargins * 2.5],
      header: planPriseHeader,
      footer: planPriseFooter({
        id: content.id,
        username: user?.display_name || user?.name || '',
      }),
      content: [
        {
          table: {
            layout: 'planPrise',
            headerRows: 1,
            dontBreakRows: true,
            body: [
              [
                ...map(planPriseColumns(content.data), (c) => ({
                  text: c.label,
                  style: [
                    'tableHeader',
                    startsWith(c.id, 'poso_') ? 'posologies' : {},
                  ],
                })),
              ],
              ...map(content.data, (m) => [
                {
                  stack: [
                    { text: m.data.denomination, style: 'denomination' },
                    {
                      text: m.data.composition.join(' + '),
                      style: 'composition',
                    },
                    {
                      text:
                        m.attributes.voies_administration.length > 0
                          ? `Voie ${m.attributes.voies_administration.join(
                              ' ou '
                            )}`
                          : '',
                      style: 'voies_administration',
                    },
                  ],
                },
                !isArray(m.attributes.conservation_duree.data)
                  ? m.attributes.conservation_duree.data
                  : '',
                ...map(m.attributes.posologies, (p) => ({
                  text: p.value,
                  style: 'posologies',
                })),
                {
                  stack: [
                    ...map(m.attributes.precautions, (p) => ({
                      text: p.commentaire,
                      margin: [0, 0, 0, 5],
                    })),
                    ...map(m.attributes.custom_precautions, (c) => ({
                      text: c.commentaire,
                      margin: [0, 0, 0, 5],
                    })),
                  ],
                },
              ]),
            ],
            widths: [
              '20%',
              'auto',
              ...map(content.data[0].attributes.posologies, () => 40),
              '*',
            ],
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
        composition: {
          italics: true,
          color: 'gray',
        },
        posologies: {
          alignment: 'center',
        },
        voies_administration: {
          fontSize: 9,
          color: 'gray',
        },
      },
    };
  };

  const generate = (document: TDocumentDefinitions) =>
    pdfMake.createPdf(document).open();

  return { fromPlanPrise, generate };
};

export default usePdf;
