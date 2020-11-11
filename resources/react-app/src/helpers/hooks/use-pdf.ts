import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {
  ContentStack,
  DynamicContent,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const pageMargins = 20;

const usePdf = ({ user }: { user: Models.App.User | null }) => {
  const fromPlanPrise = (
    content: Repositories.PlanPriseRepository
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
      id: string;
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

    const planPriseColumns = (content: Repositories.MedicamentRepository[]) => [
      { id: 'informations', label: 'Médicament' },
      { id: 'conservation', label: 'Conservation' },
      ...Object.keys(content[0].attributes.posologies).map((p) => ({
        id: content[0].attributes.posologies[p].id,
        label: content[0].attributes.posologies[p].label,
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
        id: String(content.id),
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
                ...planPriseColumns(content.data).map((c) => ({
                  text: c.label,
                  style: [
                    'tableHeader',
                    c.id.startsWith('poso_') ? 'posologies' : {},
                  ],
                })),
              ],
              ...content.data.map((m) => [
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
                !Array.isArray(m.attributes.conservation_duree.data)
                  ? m.attributes.conservation_duree.data
                  : '',
                ...m.attributes.posologies.map((p: any) => ({
                  text: p.value,
                  style: 'posologies',
                })),
                {
                  stack: [
                    ...m.attributes.precautions.map((p: any) => ({
                      text: p.commentaire,
                      margin: [0, 0, 0, 5],
                    })),
                    ...m.attributes.custom_precautions.map((c: any) => ({
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
              ...content.data[0].attributes.posologies.map(() => 40),
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
