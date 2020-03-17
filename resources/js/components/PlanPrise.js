import React, { useState, useEffect } from 'react';
import { useParams, withRouter } from 'react-router-dom';
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
import PPRepository from '../helpers/PPRepository.helper';
import { generate } from '../helpers/pdf.helper';

import PPCard from './plan-prise/PPCard';
import SearchMedicament from './generic/SearchMedicament';
import PPSettings from './plan-prise/PPSettings';
import PPSelect from './plan-prise/PPSelect';
import { SPINNER } from './params';

const PlanPrise = (props) => {

  const routeId = useParams().id
  const [showSettings, setShowSettings] = useState(false)
  const repository = new PPRepository({
    content: props.content,
    customData: props.customData,
    data: props.data,
    emptyObject: props.emptyObject,
    settings: props.settings,
  })

  useEffect(() => {
    if (!props.pp_id && routeId) {
      props.init(routeId)
    }
    if (props.list === null) {
      props.loadList()
    }
  })

  const _deletePP = async (event) => {
    event.preventDefault()
    props.setLoading({
      state: true,
      message: "Suppression du plan de prise en cours... "
    })
    return await axios.delete(`${window.php.routes.api.planprise.destroy}/${props.pp_id}`, {
      headers: {
        Authorization: `Bearer ${window.php.routes.token}`
      }
    })
    .then(() => {
      props.reset(props.history)
    })
    .catch((error) => {
      props.setLoading({
        state: false,
        message: ""
      })
      console.log('Error destroying pp', error.response)
    })
  }

  const _handleAddLine = async (value) => {
    let medicament = {
      id: value.value,
      denomination: value.label,
      type: value.type
    }
    return props.addLine(medicament)
  }

  const _generatePDF = () => {
    let columns = repository.columns
    let values = repository.values

    return generate(
      props.pp_id,
      columns,
      values
    )
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xl={8}>
          {
            props.pp_id > 0 && !props.isLoading.state
              && <Button variant="link" onClick={() => props.reset(props.history)}><span className="fa fa-arrow-left"></span> Retour à la liste</Button>
          }
          <Card>
            <Card.Header className="d-flex">
              <div className="flex-fill">
              {
                props.pp_id === -1
                  ? "Nouveau Plan de Prise"
                  : props.pp_id === null
                    ? "Que voulez-vous faire ? "
                    : "Plan de prise n°" + props.pp_id
              }
              </div>
              {
                props.pp_id > 0 && !props.isLoading.state
                  ? <div className="d-flex">
                      <a className="btn text-success py-0" href={props.pp_id + "/print"}>
                        <i className="fa fa-print"></i>
                      </a>
                      <Button variant="link" className="text-success py-0" onClick={() => _generatePDF()}>
                        <i className="fa fa-file-pdf"></i>
                      </Button>
                      <Button variant="link" className="text-secondary py-0" onClick={() => setShowSettings(true)}>
                        <i className="fa fa-cog"></i>
                      </Button>
                      <Button variant="link" className="text-danger py-0" onClick={_deletePP}>
                        <i className="fa fa-trash"></i>
                      </Button>
                  </div>
                  : null
              }
            </Card.Header>

            <Card.Body>
            {
              props.isLoading.state
                ? <div>
                    {SPINNER}
                    <span className="ml-3">{props.isLoading.message}</span>
                  </div>
                : props.pp_id === null
                  ? <PPSelect/>
                    : <TransitionGroup
                      className="plan-prise"
                      enter={false}
                    >
                      {
                        props.content && props.content.map(
                          (medicament) => {
                            if (!repository.isLoaded(medicament)) props.load(medicament)
                            return (
                              <CSSTransition
                                key={medicament.id}
                                timeout={500}
                                classNames="plan-prise-card"
                              >
                                <PPCard
                                  denomination={medicament.denomination}
                                  details={_.find(repository.valuesObject, med => med.line === medicament)}
                                  lineId={medicament.id}
                                  needChoice={_.get(repository.needChoice, medicament.id, [])}
                                  repository={repository}
                                />
                              </CSSTransition>
                            )
                          }
                        )
                      }
                      <SearchMedicament
                        multiple={false}
                        onSelect={(value) => _handleAddLine(value)}
                      />
                    </TransitionGroup>
            }
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <PPSettings
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    content: state.planPriseReducer.content,
    customData: state.planPriseReducer.customData,
    data: state.dataReducer.data,
    isLoading: state.planPriseReducer.isLoading,
    list: state.planPriseReducer.list,
    pp_id: state.planPriseReducer.pp_id,
    settings: state.planPriseReducer.settings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    init: (id) => dispatch(PP_ACTIONS.init(id)),
    loadList: () => dispatch(PP_ACTIONS.loadList()),
    reset: (history = null) => dispatch(PP_ACTIONS.reset(history)),
    setLoading: (values) => dispatch(PP_ACTIONS.setLoading(values))
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PlanPrise)
)
