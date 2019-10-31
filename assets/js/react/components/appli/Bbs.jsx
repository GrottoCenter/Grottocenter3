import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardContent, CircularProgress, withStyles, Typography,
} from '@material-ui/core';
import styled from 'styled-components';

import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import PersonIcon from '@material-ui/icons/Person';
import ClassIcon from '@material-ui/icons/Class';
import PublicIcon from '@material-ui/icons/Public';
import CategoryIcon from '@material-ui/icons/Category';

import Translate from '../common/Translate';

// =====================

const styledIcon = {
  root: {
    verticalAlign: 'bottom',
    fontSize: '2.7rem',
  },
};

const StyledHeaderInfo = withStyles({
  root: {
    fontSize: '1.7rem',
  },
})(Typography);

const StyledPublicationIcon = withStyles(styledIcon)(ImportContactsIcon);
const StyledPersonIcon = withStyles(styledIcon)(PersonIcon);
const StyledReferenceIcon = withStyles(styledIcon)(ClassIcon);
const StyledCountryIcon = withStyles(styledIcon)(PublicIcon);
const StyledThemeIcon = withStyles(styledIcon)(CategoryIcon);

// =================== End styles ==================

const Bbs = (props) => {
  const { isFetching, bbs } = props;

  if (isFetching) {
    return (<CircularProgress />);
  }

  if (bbs) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h1">{bbs.title}</Typography>

          <StyledHeaderInfo variant="body1" gutterBottom>
            <StyledPublicationIcon />
            {' '}
            <b><Translate>Published in</Translate></b>
            {' '}
            {bbs.publication}
          </StyledHeaderInfo>

          <StyledHeaderInfo variant="body1" gutterBottom>
            <StyledPersonIcon />
            {' '}
            <b><Translate>Author</Translate></b>
            {': '}
            {bbs.authors}
          </StyledHeaderInfo>

          {bbs.subtheme ? (
            <React.Fragment>
              <StyledHeaderInfo variant="body1">
                <StyledThemeIcon />
                {' '}
                <strong><Translate>Theme</Translate></strong>
                {': '}
                {bbs.subtheme.id}
                {' - '}
                <Translate>{bbs.theme}</Translate>
                {' - '}
                <Translate>{bbs.subtheme.name}</Translate>
              </StyledHeaderInfo>

              <Typography variant="body1" gutterBottom style={{ textIndent: '31px' }}>
                <strong><Translate>Secondary themes</Translate></strong>
                {': '}
                {bbs.crosChapRebuilt}
              </Typography>
            </React.Fragment>
          ) : ''}

          {bbs.country ? (
            <React.Fragment>
              <StyledHeaderInfo variant="body1">
                <StyledCountryIcon />
                {' '}
                <strong><Translate>Country or region</Translate></strong>
                {': '}
                {bbs.country.name}
              </StyledHeaderInfo>
              <Typography variant="body1" gutterBottom style={{ textIndent: '31px' }}>
                <strong><Translate>Secondary countries or regions</Translate></strong>
                {': '}
                {bbs.crosCountryRebuilt}
              </Typography>
            </React.Fragment>
          ) : ''}

          <StyledHeaderInfo variant="body1" gutterBottom>
            <StyledReferenceIcon />
            {' '}
            <strong><Translate>Reference</Translate></strong>
            {': '}
            {bbs.ref}
          </StyledHeaderInfo>

          <hr />

          {bbs.abstract ? (
            <React.Fragment>
              <Typography variant="h2" gutterBottom><Translate>Abstract</Translate></Typography>
              <Typography variant="body1" paragraph>
                {bbs.abstract}
              </Typography>
            </React.Fragment>
          ) : ''}
        </CardContent>
      </Card>
    );
  }

  return <div />;
};

Bbs.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  bbs: PropTypes.shape({}),
};
Bbs.defaultProps = {
  bbs: undefined,
};

export default Bbs;
