import useAxios from 'axios-hooks';
import Button from 'components/Button';
import SplashScreen from 'components/SplashScreen';
import useJsonApi from 'helpers/hooks/use-json-api';
import { uniqueId } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateAppNav } from 'store/app';
import AttributesEdit from '../AttributesEdit';
import PrecautionEdit from '../PrecautionEdit';

const MedicamentEdit = ({ id }: Props.Backend.MedicamentEdit) => {
  const dispatch = useDispatch();

  const { normalizeOne, requestUrl } = useJsonApi();

  const [precautions, setPrecautions] = useState<
    undefined | Models.Precaution.Extracted[]
  >();

  let medicament: Models.Medicament.Extracted | undefined = undefined;

  const [{ data, loading, error }] = useAxios<
    IServerResponse<Models.Medicament.Entity>
  >({
    url: requestUrl('medicaments', {
      id,
      include: ['bdpm', 'composition', 'precautions'],
      fields: { precautions: ['id'] },
    }).url,
  });

  useEffect(() => {
    dispatch(
      updateAppNav({
        title: `Modification de ${medicament?.denomination}`,
        returnTo: {
          path: '/admin/medicaments',
          component: { name: 'arrowLeft' },
        },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicament]);

  useEffect(() => {
    if (medicament) {
      setPrecautions(medicament.precautions);
    }
  }, [medicament]);

  if (loading) {
    return (
      <SplashScreen type="load" message={`Chargement des données en cours`} />
    );
  }

  medicament = normalizeOne(
    {
      id: id,
      type: 'medicaments',
    },
    data
  ) as Models.Medicament.Extracted;

  if (error || !medicament) {
    throw new Error('Impossible de charger les données du médicament');
  }

  return (
    <div className="space-y-4">
      <AttributesEdit medicament={medicament} />
      {(precautions || []).length > 0 && (
        <div style={{ columnCount: 3 }}>
          {(precautions || []).map((precaution) => (
            <PrecautionEdit
              key={precaution.id || uniqueId('precaution_')}
              cibles={[
                {
                  id: `medicaments_${medicament?.id}`,
                  label: medicament?.denomination || '',
                },
                ...(medicament?.composition || []).map((principeActif) => ({
                  id: `principe-actifs_${principeActif.id}`,
                  label: principeActif.denomination,
                })),
              ]}
              precaution={precaution}
              remove={(id: string) =>
                //remove(medicament?.precautions || [], { id })
                undefined
              }
            />
          ))}
          <Button
            block
            className="h-40 border-0 shadow-md"
            color="white"
            size="sm"
            onClick={() =>
              //actions.addToRelation('precautions', new Precaution())
              undefined
            }
          >
            Ajouter une précaution
          </Button>
        </div>
      )}
      {/* <ConditionalWrapper
        condition={(precautions).length > 0}
        wrapper={CardColumns}
      >
        <React.Fragment>
          {medicament.precautions.map((precaution) => (
            <PrecautionEdit
              key={precaution.id}
              cibles={[
                {
                  id: `medicaments_${medicament?.id}`,
                  label: medicament?.denomination || '',
                },
                ...(medicament?.composition || []).map((compo) => ({
                  id: `principe-actifs_${compo.id}`,
                  label: compo.denomination,
                })),
              ]}
              precaution={precaution}
              remove={(id: string) =>
                remove(medicament?.precautions || [], { id })
              }
            />
          ))}
          <Button
            color="light"
            size="sm"
            onClick={() => {
              setPrecautions([
                ...(precautions || []),
                {
                  id: uniqueId('new_'),
                  type: 'precautions',
                  commentaire: '',
                  population: '',
                  relationshipNames: [],
                  voie_administration: 0,
                },
              ]);
            }}
          >
            Ajouter une précaution
          </Button>
        </React.Fragment>
      </ConditionalWrapper> */}
    </div>
  );
};

export default MedicamentEdit;
