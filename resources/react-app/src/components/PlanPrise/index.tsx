import React, { useEffect } from 'react';
import { useParams, Redirect, useHistory } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { ActionMeta, ValueType } from 'react-select';
import AsyncSelect from 'react-select/async';
import { get, isArray, isNumber } from 'lodash';

//import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { updateAppNav } from 'store/app';
import {
  addItem,
  loadContent,
  loadList,
  resetId,
  setId,
} from 'store/plan-prise';
import { cache, inCache } from 'store/cache';
import useLoadAsync from 'helpers/hooks/use-load-async';
//import PPRepository from 'helpers/PPRepository.helper';
//import generate from 'helpers/pdf.helper';

import Selection from './Selection';
import Interface from './Interface';
import Settings from './Settings';

const mapState = (state: ReduxState) => ({
  cacheState: state.cache,
  content: state.planPrise.content,
  id: state.planPrise.id,
  list: state.planPrise.list,
});

const mapDispatch = {
  addItem,
  cache,
  loadContent,
  loadList,
  resetId,
  setId,
  updateAppNav,
};

const connector = connect(mapState, mapDispatch);

type PlanPriseProps = ConnectedProps<typeof connector>;

const PlanPrise = ({
  addItem,
  cache,
  cacheState,
  content,
  id,
  list,
  loadContent,
  loadList,
  resetId,
  setId,
  updateAppNav,
}: PlanPriseProps) => {
  const history = useHistory();
  const { loadGeneric } = useLoadAsync();
  const showSettings = get(useParams(), 'showSettings') === 'settings';
  const routeIdParam = get(useParams(), 'id', null);
  const isValidRoute = !isNaN(Number(routeIdParam));
  const isRootRoute = routeIdParam === null;
  const routeId = Number(routeIdParam);
  const contentLoaded = get(content, 'id') === routeId;

  const getTitle = (id: number | null) => {
    if (id === -1) {
      return 'Nouveau Plan de Prise';
    }
    if (id && id > 0) {
      return `Plan de prise n°${id}`;
    }
    return 'Que voulez-vous faire ? ';
  };

  const handleChange = (
    value: ValueType<{ label: string; value: string; type: string }>,
    { action }: ActionMeta<{ label: string; value: string; type: string }>
  ) => {
    if (
      action === 'select-option' &&
      value &&
      'value' in value &&
      'type' in value
    ) {
      if (isArray(value))
        throw new Error('Un seul médicament peut être ajouté à la fois');
      addItem({ id: value.value, type: value.type });
      if (
        value.type === 'api-medicament' &&
        !inCache({ id: value.value, type: value.type }, cacheState)
      ) {
        cache({
          id: value.value,
          type: value.type,
          attributes: { denomination: value.label },
        });
      }
    }
  };

  useEffect(() => {
    if (isRootRoute && list === null) {
      loadList();
    }
  }, [isRootRoute, list, loadList]);

  useEffect(() => {
    if (isNumber(id) && !routeId) resetId();
    if (isValidRoute && !isRootRoute && routeId) {
      if (id !== routeId) setId(routeId);
      if (!contentLoaded && content !== 'loading') loadContent(routeId);
    }
  }, [
    content,
    contentLoaded,
    id,
    isRootRoute,
    isValidRoute,
    loadContent,
    resetId,
    routeId,
    setId,
  ]);

  useEffect(() => {
    updateAppNav({
      title: getTitle(id),
      returnTo: isNumber(id)
        ? {
            path: '/plan-prise',
            label: 'arrow-left',
          }
        : undefined,
      options: isNumber(id)
        ? [
            {
              path: `/plan-prise/${id}/settings`,
              label: 'cog',
            },
          ]
        : undefined,
    });
  }, [id, updateAppNav]);

  /*const deletePP = async (event) => {
    event.preventDefault();
    const { history, id, reset, setLoading } = props;
    setLoading({
      state: true,
      message: 'Suppression du plan de prise en cours... ',
    });
    return axios
      .delete(`${window.php.routes.api.planprise.destroy}/${id}`, {
        data: {
          token: window.php.routes.token,
        },
      })
      .then(() => {
        reset(history);
      })
      .catch((error) => {
        setLoading({
          state: false,
          message: '',
        });
        console.log('Error destroying pp', error);
      });
  };

  const handleAddLine = async (value) => {
    const { addLine, history } = props;
    const medicament = {
      id: value.value,
      denomination: value.label,
      type: value.type,
    };
    return addLine(medicament, history);
  };

  const generatePDF = () => {
    const { id, repository } = props;
    const { columns, values } = repository;

    return generate(id, columns, values);
  };*/

  if (!isValidRoute) {
    console.log(routeId);
    return <Redirect to="/plan-prise" />;
  }

  if (isRootRoute) return <Selection />;

  if (isValidRoute && routeId)
    return (
      <React.Fragment>
        <AsyncSelect
          className="mb-4"
          loadOptions={loadGeneric}
          loadingMessage={() => 'Chargement des résultats en cours'}
          noOptionsMessage={(p) =>
            p.inputValue.length > 0
              ? 'Aucun résultat'
              : "Taper le nom d'un médicament pour commencer la recherche"
          }
          onChange={handleChange}
          placeholder="Ajouter un médicament au plan de prise"
          value={null}
        />
        <Interface />
        <Settings
          show={contentLoaded && showSettings}
          toggle={() => history.replace(`/plan-prise/${routeId}`)}
        />
      </React.Fragment>
    );

  return <div>Erreur</div>;

  /*return (
    <React.Fragment>
      {ppId > 0 && !isLoading.state ? (
        <div className="d-flex">
          <a className="btn text-success py-0" href={`${ppId}/print`}>
            <i className="fa fa-print" />
          </a>
          <Button
            className="text-success py-0"
            variant="link"
            onClick={() => generatePDF()}
          >
            <i className="fa fa-file-pdf" />
          </Button>
          <Button
            className="text-secondary py-0"
            variant="link"
            onClick={() => setShowSettings(true)}
          >
            <i className="fa fa-cog" />
          </Button>
          <Button
            className="text-danger py-0"
            variant="link"
            onClick={deletePP}
          >
            <i className="fa fa-trash" />
          </Button>
        </div>
      ) : null}

      {(() => {
        if (isLoading.state) {
          return (
            <div>
              <Spinner />
              <span className="ml-3">{isLoading.message}</span>
            </div>
          );
        }

        return (
          <TransitionGroup className="plan-prise" enter={false}>
            {content &&
              map(content, (medicament) => {
                return (
                  <CSSTransition
                    key={medicament.id}
                    classNames="plan-prise-card"
                    timeout={500}
                  >
                    <PPCard
                      denomination={medicament.denomination}
                      details={find(repository.valuesObject, [
                        'line',
                        medicament,
                      ])}
                      isLoaded={repository.isLoaded(medicament)}
                      lineId={medicament.id}
                      needChoice={get(repository.needChoice, medicament.id, [])}
                      repository={repository}
                    />
                  </CSSTransition>
                );
              })}
            <SearchMedicament multiple={false} onSelect={handleAddLine} />
          </TransitionGroup>
        );
      })()}
      <Settings setShowSettings={setShowSettings} showSettings={showSettings} />
    </React.Fragment>
  );*/
};

export default connector(PlanPrise);
