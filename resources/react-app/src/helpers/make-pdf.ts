import {
  ContentStack,
  DynamicContent,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import {
  makeUniqueSelectorInstance,
  selectPlanPriseColumns,
  selectPlanPriseID,
} from 'store/plan-prise/selectors/plan-prise';

const pageMargins = 20;

export const generate = async (document: TDocumentDefinitions) => {
  const pdfMake = (await import('pdfmake/build/pdfmake')).default;
  const pdfFonts = (await import('pdfmake/build/vfs_fonts')).default;

  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  pdfMake.createPdf(document).open();
};

export const fromPlanPrise = (
  state: IRedux.State,
  user: Models.App.User
): TDocumentDefinitions => {
  const planPriseContent = (
    state.planPrise.content.data?.medicaments || []
  ).map((medicament) =>
    makeUniqueSelectorInstance()(state, {
      type: medicament.type,
      id: medicament.id,
    })
  );

  if (planPriseContent.includes(null)) {
    throw new Error(
      'Un contenu est manquant. Impossible de générer le plan de prise'
    );
  }

  const planPriseColumns = selectPlanPriseColumns(state);

  const planPriseId = selectPlanPriseID(state);

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

  const planPriseFooter = (): DynamicContent => (currentPage, pageCount) => ({
    columns: [
      {
        text: `Édité par ${user.display_name || user.name}`,
        style: 'footer',
      },
      {
        text: `Plan de prise n°${planPriseId}`,
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

  return {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [pageMargins, pageMargins * 2.5],
    header: planPriseHeader,
    footer: planPriseFooter(),
    content: [
      {
        table: {
          layout: 'planPrise',
          headerRows: 1,
          dontBreakRows: true,
          body: [
            [
              ...planPriseColumns.map((c) => ({
                text: c.label,
                style: [
                  'tableHeader',
                  c.id.startsWith('poso_') ? 'posologies' : {},
                ],
              })),
            ],
            ...planPriseContent.map((m) => [
              {
                stack: [
                  { text: m?.denomination || '', style: 'denomination' },
                  {
                    text: m?.composition || '',
                    style: 'composition',
                  },
                  {
                    text:
                      (m?.voies_administration || []).length > 0
                        ? `Voie ${(m?.voies_administration || []).join(' ou ')}`
                        : '',
                    style: 'voies_administration',
                  },
                ],
              },
              {
                text:
                  Array.isArray(m?.conservation_duree?.data) &&
                  m?.conservation_duree?.data.length === 1
                    ? m?.conservation_duree?.data[0]
                    : '',
              },
              ...(m?.posologies || []).map((p: any) => ({
                text: p.value,
                style: 'posologies',
              })),
              {
                stack: [
                  ...(m?.precautions || []).map((p: any) => ({
                    text: p.commentaire,
                    margin: [0, 0, 0, 5],
                  })),
                  ...(m?.custom_precautions || []).map((c: any) => ({
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
            ...planPriseColumns
              .filter((i) => i.id.startsWith('poso_'))
              .map(() => 40),
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
