import React from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";

//test
import {
  loadList
} from '../../redux/plan-prise/actions';

class Accueil extends React.Component {
  render() {
    return (
      <Button onClick={this.props.loadList}>Test</Button>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadList: () => dispatch(loadList())
  }
}

export default connect(null, mapDispatchToProps)(Accueil)