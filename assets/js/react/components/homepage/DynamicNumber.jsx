import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import {DYNAMIC_NUMBER_RELOAD_INTERVAL} from '../../conf/Config';
import {loadDynamicNumber} from '../../actions/DynamicNumber';
import SyncKOIcon from '@material-ui/icons/SyncProblem';
import IconButton from '@material-ui/core/IconButton';
import { withTheme } from '@material-ui/core/styles';
import styled from 'styled-components';
import Translate from '../common/Translate';

const NumberIcon = styled(IconButton)`
  svg {
    height: 48px !important; // lesshint importantRule: false
    width: 48px !important; // lesshint importantRule: false
  }
`;

class DynamicNumber extends Component {
  constructor(props) {
    super(props);
    this.reloadNumber = this.reloadNumber.bind(this);
    this.reloadNumber()();
  }

  reloadNumber() {
    return () => this.props.dispatch(loadDynamicNumber(this.props.numberType));
  }

  componentDidMount() {
    this.interval = setInterval(this.reloadNumber(), DYNAMIC_NUMBER_RELOAD_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    if (this.props.isFetching) {
      return (<CircularProgress />);

    } else if (!this.props.number) {
      return (
          <Translate>
            <NumberIcon tooltip='Synchronisation error'>
              <SyncKOIcon color={this.props.theme.palette.primary3Color} hoverColor={this.props.theme.palette.accent1Color}/>
            </NumberIcon>
          </Translate>
      );
    }
    return (
      <span className={this.props.className}>{this.props.number}</span>
    );
  }
}

DynamicNumber.propTypes = {
  isFetching: PropTypes.bool,
  number: PropTypes.number,
  numberType: PropTypes.string,
  className: PropTypes.string,
  dispatch: PropTypes.any.isRequired,
  theme: PropTypes.object.isRequired
};

export default withTheme()(DynamicNumber);
