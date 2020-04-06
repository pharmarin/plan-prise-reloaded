import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Button,
  Container,
  Row,
  Col,
  Card
} from 'react-bootstrap';
import _ from 'lodash';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import * as PP_ACTIONS from '../redux/plan-prise/actions';
import * as DATA_ACTIONS from '../redux/data/actions';
import PPRepository from '../helpers/PPRepository.helper';
import { generate } from '../helpers/pdf.helper';

import PPCard from './plan-prise/PPCard';
import SearchMedicament from './generic/SearchMedicament';
import PPSettings from './plan-prise/PPSettings';
import PPSelect from './plan-prise/PPSelect';
import { SPINNER } from './params';

class PlanPrise extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showSettings: false
    }
  }

  componentDidMount() {
    this._init()
  }

  componentDidUpdate() {
    this._init()
    if (this.count === 50) {
      throw Error()
    } else {
      this.count = (this.count || 0) + 1
    }
  }

  _init = () => {
    let routeId = this.props.match.params.id
    if (!this.props.pp_id && routeId) {
      this.props.init(routeId)
    }
    if (this.props.list === null) {
      this.props.loadList()
    }
    this.props.content && this.props.content.forEach(medicament => {
      if (
        !this.props.repository.isLoaded(medicament) 
        && !this.props.repository.isLoading(medicament)
      ) {
        this.props.load(medicament)
      }
    })
  }

  _deletePP = async (event) => {
    event.preventDefault()
    this.props.setLoading({
      state: true,
      message: "Suppression du plan de prise en cours... "
    })
    return await axios.delete(`${window.php.routes.api.planprise.destroy}/${props.pp_id}`, {
      data: {
        token: window.php.routes.token,
      }
    })
    .then(() => {
      this.props.reset(props.history)
    })
    .catch((error) => {
      this.props.setLoading({
        state: false,
        message: ""
      })
      console.log('Error destroying pp', error.response)
    })
  }

  _handleAddLine = async (value) => {
    let medicament = {
      id: value.value,
      denomination: value.label,
      type: value.type
    }
    return this.props.addLine(medicament)
  }

  _generatePDF = () => {
    let columns = this.props.repository.columns
    let values = this.props.repository.values

    return generate(
      this.props.pp_id,
      columns,
      values
    )
  }

  render() {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col xl={8}>
            {
              this.props.pp_id && !this.props.isLoading.state
              && <Button variant="link" onClick={() => this.props.reset(props.history)}><span className="fa fa-arrow-left"></span> Retour à la liste</Button>
            }
            <Card>
              <Card.Header className="d-flex">
                <div className="flex-fill">
                  {
                    this.props.pp_id === -1
                      ? "Nouveau Plan de Prise"
                      : this.props.pp_id === null
                        ? "Que voulez-vous faire ? "
                        : "Plan de prise n°" + this.props.pp_id
                  }
                </div>
                {
                  this.props.pp_id > 0 && !this.props.isLoading.state
                    ? <div className="d-flex">
                      <a className="btn text-success py-0" href={this.props.pp_id + "/print"}>
                        <i className="fa fa-print"></i>
                      </a>
                      <Button variant="link" className="text-success py-0" onClick={() => this._generatePDF()}>
                        <i className="fa fa-file-pdf"></i>
                      </Button>
                      <Button variant="link" className="text-secondary py-0" onClick={() => this.setShowSettings(true)}>
                        <i className="fa fa-cog"></i>
                      </Button>
                      <Button variant="link" className="text-danger py-0" onClick={this._deletePP}>
                        <i className="fa fa-trash"></i>
                      </Button>
                    </div>
                    : null
                }
              </Card.Header>

              <Card.Body>
                {
                  this.props.isLoading.state
                    ? <div>
                      {SPINNER}
                      <span className="ml-3">{this.props.isLoading.message}</span>
                    </div>
                    : this.props.pp_id === null
                      ? <PPSelect />
                      : <TransitionGroup
                        className="plan-prise"
                        enter={false}
                      >
                        {
                          this.props.content && this.props.content.map(
                            (medicament) => {
                              return (
                                <CSSTransition
                                  key={medicament.id}
                                  timeout={500}
                                  classNames="plan-prise-card"
                                >
                                  <PPCard
                                    denomination={medicament.denomination}
                                    details={_.find(this.props.repository.valuesObject, med => med.line === medicament)}
                                    isLoaded={this.props.repository.isLoaded(medicament)}
                                    lineId={medicament.id}
                                    needChoice={_.get(this.props.repository.needChoice, medicament.id, [])}
                                    repository={this.props.repository}
                                  />
                                </CSSTransition>
                              )
                            }
                          )
                        }
                        <SearchMedicament
                          multiple={false}
                          onSelect={(value) => this._handleAddLine(value)}
                        />
                      </TransitionGroup>
                }
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <PPSettings
          showSettings={this.state.showSettings}
          setShowSettings={(a) => this.setState({showSettings: a})}
        />
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    content: state.planPriseReducer.content,
    customData: state.planPriseReducer.customData,
    data: state.dataReducer.data,
    isLoading: state.planPriseReducer.isLoading,
    list: state.planPriseReducer.list,
    pp_id: state.planPriseReducer.pp_id,
    repository: new PPRepository({
      content: state.planPriseReducer.content,
      customData: state.planPriseReducer.customData,
      data: state.dataReducer.data,
      settings: state.planPriseReducer.settings,
    }),
    settings: state.planPriseReducer.settings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    init: (id) => dispatch(PP_ACTIONS.init(id)),
    load: (medicament) => dispatch(DATA_ACTIONS.load(medicament)),
    loadList: () => dispatch(PP_ACTIONS.loadList()),
    reset: (history = null) => dispatch(PP_ACTIONS.reset(history)),
    setLoading: (values) => dispatch(PP_ACTIONS.setLoading(values))
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PlanPrise)
)
