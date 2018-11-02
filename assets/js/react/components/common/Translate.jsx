import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const Translate = (props) => (
  props.children ? <FormattedMessage id={props.children} /> : <FormattedMessage {...props} />
);


Translate.propTypes = {
  children: PropTypes.string
};

Translate.defaultProps = {
  children: null
};

export default Translate;
