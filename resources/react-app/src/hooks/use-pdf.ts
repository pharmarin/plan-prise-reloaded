import switchVoieAdministration from 'helpers/switch-voie-administration';
import PlanPrise from 'models/PlanPrise';
import User from 'models/User';
import {
  ContentStack,
  DynamicContent,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';

const usePdf = () => {
  const pageMargins = 20;

  const generate = async (document: TDocumentDefinitions) => {
    const pdfMake = (await import('pdfmake/build/pdfmake')).default;
    const pdfFonts = (await import('pdfmake/build/vfs_fonts')).default;

    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    pdfMake.createPdf(document).open();
  };

  const fromPlanPrise = (
    planPrise: PlanPrise,
    user: User
  ): TDocumentDefinitions => {
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
          text: `Édité par ${
            user.display_name || `${user.first_name} ${user.last_name}`
          }`,
          style: 'footer',
        },
        {
          text: `Plan de prise n°${planPrise.meta.id}`,
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

    const columns = [
      {
        id: 'informations',
        label: 'Médicament',
      },
      ...Object.values(planPrise.columns).filter((column) => column.display),
      {
        id: 'comments',
        label: 'Commentaires',
      },
    ];

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
                ...columns.map((column) => ({
                  text: column.label,
                  style: [
                    'tableHeader',
                    column.id.startsWith('poso_') ? 'posologies' : {},
                  ],
                })),
              ],
              ...planPrise.medicaments.map((medicament) => {
                const conservationDuree =
                  medicament.isMedicament() &&
                  planPrise.conservationsDuree(medicament);
                const posologies = planPrise.posologies(medicament);
                const precautions = planPrise.precautions(medicament);
                const customPrecautions = planPrise.customPrecautions(
                  medicament
                );

                return [
                  {
                    stack: [
                      {
                        text: medicament?.denomination || '',
                        margin: [0, 0, 0, 2.5],
                        style: 'denomination',
                      },
                      {
                        text: medicament.isMedicament()
                          ? medicament?.composition
                              .map(
                                (principeActif) => principeActif.denomination
                              )
                              .join(' + ') || ''
                          : '',
                        margin: [0, 0, 0, 2.5],
                        style: 'composition',
                      },
                      {
                        text:
                          medicament.isMedicament() &&
                          (medicament?.voies_administration || []).length > 0
                            ? `(Voie ${(
                                medicament?.voies_administration.map(
                                  (voieAdministration) =>
                                    switchVoieAdministration(voieAdministration)
                                ) || []
                              ).join(' ou ')})`
                            : '',
                        margin: [0, 0, 0, 2.5],
                        style: 'voies_administration',
                      },
                      {
                        text:
                          conservationDuree &&
                          conservationDuree?.data.length === 1
                            ? `Après ouverture : ${conservationDuree?.data[0]}`
                            : '',
                        style: 'conservation_duree',
                      },
                    ],
                  },
                  ...(posologies || []).map((p: any) => ({
                    text: p.value,
                    style: 'posologies',
                  })),
                  {
                    stack: [
                      ...(precautions || []).map((p: any) => ({
                        text: p.commentaire,
                        margin: [0, 0, 0, 5],
                      })),
                      ...(customPrecautions || []).map((c: any) => ({
                        text: c.commentaire,
                        margin: [0, 0, 0, 5],
                      })),
                    ],
                  },
                ];
              }),
            ],
            widths: [
              '25%',
              ...columns.filter((i) => i.id.startsWith('poso_')).map(() => 40),
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
          color: 'dimgray',
        },
        posologies: {
          alignment: 'center',
        },
        voies_administration: {
          fontSize: 9,
          color: 'gray',
        },
        conservation_duree: {
          fontSize: 9,
        },
      },
    };
  };

  return {
    generate,
    fromPlanPrise,
  };
};

export default usePdf;
