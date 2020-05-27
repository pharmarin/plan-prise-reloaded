import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Spinner } from 'react-bootstrap';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import map from 'lodash/map';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { updateAppNav } from 'store/app';
import {
  doAddLine,
  doInit,
  doLoadList,
  doReset,
  doSetLoading,
} from 'store/plan-prise/actions';
import { doLoad } from 'store/data/actions';
import PPRepository from 'helpers/PPRepository.helper';
import generate from 'helpers/pdf.helper';

import PPCard from 'components/plan-prise/PPCard';
import SearchMedicament from 'components/search/SearchMedicament';
import PPSettings from 'components/plan-prise/PPSettings';
import PPSelect from 'components/plan-prise/PPSelect';

const PlanPrise = (props) => {
  const {
    content,
    history,
    isLoading,
    repository,
    reset,
    ppId,
    updateAppNav,
  } = props;

  const [showSettings, setShowSettings] = useState(false);

  const getTitle = (id) => {
    if (id === -1) {
      return 'Nouveau Plan de Prise';
    }
    if (id === null) {
      return 'Que voulez-vous faire ? ';
    }
    if (id > 0) {
      return `Plan de prise n°${id}`;
    }
  };

  /* ppId && !isLoading.state && (
              <Button variant="link" onClick={() => reset(history)}>
                <span className="fa fa-arrow-left" />
                Retour à la liste
              </Button>
            ) */
  useEffect(() => {
    updateAppNav({
      title: getTitle(ppId),
    });
  }, [ppId, updateAppNav]);

  useEffect(() => {
    init();
  });

  const init = () => {
    const {
      content,
      init,
      list,
      load,
      loadList,
      match,
      ppId,
      repository,
    } = props;
    const routeId = match.params.id;
    if (!ppId && routeId) {
      init(routeId);
    }
    if (list === null) {
      loadList();
    }
    if (content) {
      forEach(content, (medicament) => {
        if (
          !repository.isLoaded(medicament) &&
          !repository.isLoading(medicament)
        ) {
          load(medicament);
        }
      });
    }
  };

  const deletePP = async (event) => {
    event.preventDefault();
    const { history, ppId, reset, setLoading } = props;
    setLoading({
      state: true,
      message: 'Suppression du plan de prise en cours... ',
    });
    return axios
      .delete(`${window.php.routes.api.planprise.destroy}/${ppId}`, {
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
    const { ppId, repository } = props;
    const { columns, values } = repository;

    return generate(ppId, columns, values);
  };

  return (
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
        if (ppId === null) {
          return <PPSelect />;
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
      <PPSettings
        setShowSettings={setShowSettings}
        showSettings={showSettings}
      />
    </React.Fragment>
  );
};

PlanPrise.propTypes = {
  addLine: PropTypes.func,
  content: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      denomination: PropTypes.string,
    })
  ),
  history: PropTypes.any,
  init: PropTypes.func,
  isLoading: PropTypes.shape({
    message: PropTypes.any,
    state: PropTypes.any,
  }),
  list: PropTypes.any,
  load: PropTypes.func,
  loadList: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.any,
    }),
  }),
  ppId: PropTypes.number,
  repository: PropTypes.shape({
    columns: PropTypes.any,
    isLoaded: PropTypes.func,
    isLoading: PropTypes.func,
    needChoice: PropTypes.bool,
    values: PropTypes.any,
    valuesObject: PropTypes.any,
  }),
  reset: PropTypes.func,
  setLoading: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    content: state.planPrise.content,
    customData: state.planPrise.customData,
    data: state.data.data,
    isLoading: state.planPrise.isLoading,
    list: state.planPrise.list,
    ppId: state.planPrise.pp_id,
    repository: new PPRepository({
      content: state.planPrise.content,
      customData: state.planPrise.customData,
      data: state.data.data,
      settings: state.planPrise.settings,
    }),
    settings: state.planPrise.settings,
  };
};

const mapDispatchToProps = {
  addLine: (medicament, history) => doAddLine(medicament, history),
  init: (id) => doInit(id),
  load: (medicament) => doLoad(medicament),
  loadList: () => doLoadList(),
  reset: (history = null) => doReset(history),
  setLoading: (values) => doSetLoading(values),
  updateAppNav,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PlanPrise)
);
