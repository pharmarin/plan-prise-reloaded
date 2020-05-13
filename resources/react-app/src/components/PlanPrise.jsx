import PropTypes from "prop-types";
import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import find from "lodash/find";
import forEach from "lodash/forEach";
import get from "lodash/get";
import map from "lodash/map";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import {
  doAddLine,
  doInit,
  doLoadList,
  doReset,
  doSetLoading,
} from "store/plan-prise/actions";
import { doLoad } from "store/data/actions";
import PPRepository from "../helpers/PPRepository.helper";
import generate from "../helpers/pdf.helper";

import PPCard from "./plan-prise/PPCard";
import SearchMedicament from "./search/SearchMedicament";
import PPSettings from "./plan-prise/PPSettings";
import PPSelect from "./plan-prise/PPSelect";

class PlanPrise extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSettings: false,
    };
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate() {
    this.init();
    if (this.count === 50) {
      throw Error();
    } else {
      this.count = (this.count || 0) + 1;
    }
  }

  init = () => {
    const {
      content,
      init,
      list,
      load,
      loadList,
      match,
      ppId,
      repository,
    } = this.props;
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

  deletePP = async (event) => {
    event.preventDefault();
    const { history, ppId, reset, setLoading } = this.props;
    setLoading({
      state: true,
      message: "Suppression du plan de prise en cours... ",
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
          message: "",
        });
        console.log("Error destroying pp", error);
      });
  };

  handleAddLine = async (value) => {
    const { addLine, history } = this.props;
    const medicament = {
      id: value.value,
      denomination: value.label,
      type: value.type,
    };
    return addLine(medicament, history);
  };

  generatePDF = () => {
    const { ppId, repository } = this.props;
    const { columns, values } = repository;

    return generate(ppId, columns, values);
  };

  render() {
    const { content, history, isLoading, ppId, repository, reset } = this.props;
    const { showSettings } = this.state;
    return (
      <Container>
        <Row className="justify-content-center">
          <Col xl={8}>
            {ppId && !isLoading.state && (
              <Button variant="link" onClick={() => reset(history)}>
                <span className="fa fa-arrow-left" />
                Retour à la liste
              </Button>
            )}
            <Card>
              <Card.Header className="d-flex">
                <div className="flex-fill">
                  {(() => {
                    if (ppId === -1) {
                      return "Nouveau Plan de Prise";
                    }
                    if (ppId === null) {
                      return "Que voulez-vous faire ? ";
                    }
                    if (ppId > 0) {
                      return `Plan de prise n°${ppId}`;
                    }
                    return null;
                  })()}
                </div>
                {ppId > 0 && !isLoading.state ? (
                  <div className="d-flex">
                    <a className="btn text-success py-0" href={`${ppId}/print`}>
                      <i className="fa fa-print" />
                    </a>
                    <Button
                      className="text-success py-0"
                      variant="link"
                      onClick={() => this.generatePDF()}
                    >
                      <i className="fa fa-file-pdf" />
                    </Button>
                    <Button
                      className="text-secondary py-0"
                      variant="link"
                      onClick={() => this.setShowSettings(true)}
                    >
                      <i className="fa fa-cog" />
                    </Button>
                    <Button
                      className="text-danger py-0"
                      variant="link"
                      onClick={this.deletePP}
                    >
                      <i className="fa fa-trash" />
                    </Button>
                  </div>
                ) : null}
              </Card.Header>

              <Card.Body>
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
                                  "line",
                                  medicament,
                                ])}
                                isLoaded={repository.isLoaded(medicament)}
                                lineId={medicament.id}
                                needChoice={get(
                                  repository.needChoice,
                                  medicament.id,
                                  []
                                )}
                                repository={repository}
                              />
                            </CSSTransition>
                          );
                        })}
                      <SearchMedicament
                        multiple={false}
                        onSelect={(value) => this.handleAddLine(value)}
                      />
                    </TransitionGroup>
                  );
                })()}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <PPSettings
          setShowSettings={(a) => this.setState({ showSettings: a })}
          showSettings={showSettings}
        />
      </Container>
    );
  }
}

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

const mapDispatchToProps = (dispatch) => {
  return {
    addLine: (medicament, history) => dispatch(doAddLine(medicament, history)),
    init: (id) => dispatch(doInit(id)),
    load: (medicament) => dispatch(doLoad(medicament)),
    loadList: () => dispatch(doLoadList()),
    reset: (history = null) => dispatch(doReset(history)),
    setLoading: (values) => dispatch(doSetLoading(values)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PlanPrise)
);
