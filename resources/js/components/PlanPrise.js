import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Container,
  Row,
  Col,
  Card
} from 'react-bootstrap';
import _ from 'lodash';

import * as PP_ACTIONS from '../redux/plan-prise/actions';
import * as DATA_ACTIONS from '../redux/data/actions';

import PPLogic from './plan-prise/PPLogic';
import PPOptions from './plan-prise/PPOptions';
import PPSelect from './plan-prise/PPSelect';
import { SPINNER } from './params';

const PlanPrise = (props) => {

  const [showOptions, setShowOptions] = useState(false)

  useEffect(() => {
    // Load PP list
    if (props.list === null) {
      props.loadList()
    }
  })

  // #region PP methods
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
      props.reset()
    })
    .catch((error) => {
      props.setLoading({
        state: false,
        message: ""
      })
      console.log('Error destroying pp', error.response)
    })
  }
  // #endregion

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xl={8}>
          {
            props.pp_id > 0 && !props.isLoading.state
              && <Button variant="link" onClick={props.reset}><span className="fa fa-arrow-left"></span> Retour à la liste</Button>
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
                    <div>
                      <Button variant="link" className="text-secondary py-0" onClick={() => setShowOptions(true)}>
                      <i className="fa fa-cog"></i>
                      </Button>
                    </div>
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
                  : <PPLogic/>
            }
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <PPOptions
        showOptions={showOptions}
        setShowOptions={setShowOptions}
      />
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.planPriseReducer.isLoading,
    list: state.planPriseReducer.list,
    pp_id: state.planPriseReducer.pp_id,
    settings: state.planPriseReducer.settings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadList: () => dispatch(PP_ACTIONS.loadList()),
    cacheDetails: (details) => dispatch(DATA_ACTIONS.cacheDetails(details)),
    reset: () => dispatch(PP_ACTIONS.reset()),
    setLoading: (values) => dispatch(PP_ACTIONS.setLoading(values)),
    updateSettings: (input, value) => dispatch(PP_ACTIONS.updateSettings(input, value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlanPrise)
