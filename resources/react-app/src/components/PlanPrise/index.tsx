import React, { useEffect, useState } from 'react';
//import axios from 'axios';
import { useParams, Link, Redirect } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
//import { Button, Spinner } from 'react-bootstrap';
//import find from 'lodash/find';
//import forEach from 'lodash/forEach';
import get from 'lodash/get';
import toNumber from 'lodash/toNumber';
//import map from 'lodash/map';
//import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { updateAppNav } from 'store/app';
import { loadList, resetId, setId } from 'store/plan-prise';
/*import {
  doAddLine,
  doInit,
  doLoadList,
  doReset,
  doSetLoading,
} from 'store/plan-prise/actions';*/
//import { doLoad } from 'store/data/actions';
//import PPRepository from 'helpers/PPRepository.helper';
//import generate from 'helpers/pdf.helper';

//import PPCard from 'components/plan-prise/PPCard';
//import SearchMedicament from 'components/search/SearchMedicament';
//import Settings from './Settings';
import Selection from './Selection';
import Interface from './Interface';
import { Card, CardHeader, Button } from 'reactstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { listenerCount } from 'process';
import { includes, isArray, isNumber } from 'lodash';

const mapState = (state: ReduxState) => ({
  id: state.planPrise.id,
  list: state.planPrise.list,
});

const mapDispatch = {
  loadList,
  resetId,
  setId,
  updateAppNav,
};

const connector = connect(mapState, mapDispatch);

type PlanPriseProps = ConnectedProps<typeof connector>;

const PlanPrise = (props: PlanPriseProps) => {
  const { id, list, loadList, resetId, setId, updateAppNav } = props;
  const showSettings = get(useParams(), 'showSettings') === 'settings';
  const routeIdParam = get(useParams(), 'id', null);
  const routeId =
    !isNaN(Number(routeIdParam)) && routeIdParam !== 0
      ? Number(routeIdParam)
      : null;
  const isRootRoute = routeId === 0;

  const getTitle = (id: number | null) => {
    if (id === -1) {
      return 'Nouveau Plan de Prise';
    }
    if (id && id > 0) {
      return `Plan de prise n°${id}`;
    }
    return 'Que voulez-vous faire ? ';
  };

  useEffect(() => {
    setId(routeId);
  }, [id, routeId, setId, updateAppNav]);

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

  useEffect(() => {
    if (isRootRoute && list === null) {
      loadList();
    }
  }, [isRootRoute, list, loadList]);

  useEffect(() => {
    if (isNumber(id) && !routeId) {
      resetId();
    }
  }, [id, resetId, routeId]);

  const init = () => {
    const { list, loadList } = props;
    /*const routeId = match.params.id;
    if (!id && routeId) {
      init(routeId);
    }*/
    if (list === null) {
      loadList();
    }
    /*if (content) {
      forEach(content, (medicament) => {
        if (
          !repository.isLoaded(medicament) &&
          !repository.isLoading(medicament)
        ) {
          load(medicament);
        }
      });
    }*/
  };

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

  if (!routeId && !isRootRoute) {
    console.log(routeId);
    return <Redirect to="/plan-prise" />;
  }

  if (isRootRoute) {
    return <Selection />;
  }

  if (routeId) {
    return <Interface routeId={routeId} />;
  }

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
