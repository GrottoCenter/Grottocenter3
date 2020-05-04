import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';

import Translate from '../../common/Translate';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: ${({ theme }) => theme.spacing(1)}px;
`;

const EntryRating = ({ value, label }) => {
  return (
    <Wrapper>
      <Typography color="primary" component="legend">
        <Translate>{label}</Translate>
      </Typography>
      <Rating
        readOnly
        name={label}
        defaultValue={value}
        precision={0.5}
        emptyIcon={<StarBorderIcon fontSize="inherit" />}
      />
    </Wrapper>
  );
};

EntryRating.propTypes = {
  value: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
};

export default EntryRating;
