import React from 'react';
import { isMobileOnly } from 'react-device-detect';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Button,
  Divider,
  FormControl,
  LinearProgress,
  Step,
  StepLabel,
  Stepper,
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import Translate from '../../../common/Translate';

import FormBody from './FormBody';

// ===================================
const NextStepButton = (props) => (
  <Button
    {...props}
    variant="contained"
    color="primary"
    endIcon={<NavigateNextIcon />}
  >
    <Translate>Next</Translate>
  </Button>
);

const PreviousStepButton = (props) => (
  <Button
    {...props}
    variant="contained"
    color="primary"
    startIcon={<NavigateBeforeIcon />}
  >
    <Translate>Back</Translate>
  </Button>
);

const ChangeStepWrapper = styled(FormControl)`
  display: block;
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
`;

const StyledDivider = styled(Divider)`
  margin: ${({ theme }) => theme.spacing(3)}px 0;
`;

const SubmitButton = styled(Button)`
  display: block;
  margin: auto;
`;

// ===================================

const DocumentForm = ({
  allAuthors,
  allIdentifierTypes,
  allLanguages,
  allLibraries,
  allMassifs,
  allPartOf,
  allRegions,
  allSubjects,
  formSteps,
  isLoading,
  onSubmit,
}) => {
  const [currentFormStepId, setCurrentFormStepId] = React.useState(
    formSteps[0].id,
  );

  const [
    isNextStepButtonDisabled,
    setIsNextStepButtonDisabled,
  ] = React.useState(true);

  const [isFormValid, setIsFormValid] = React.useState(false);

  const updateIsNextStepButtonDisabled = () => {
    const lastStep = currentFormStepId === formSteps.length;
    const currentStep = formSteps.find((s) => s.id === currentFormStepId);
    setIsNextStepButtonDisabled(lastStep || !currentStep.isValid);
  };

  const onStepIsValidChange = (stepId, isValid) => {
    const stepToUpdate = formSteps.find((step) => step.id === stepId);
    stepToUpdate.isValid = isValid;
    setIsFormValid(formSteps.every((step) => step.isValid));
    updateIsNextStepButtonDisabled();
  };

  React.useEffect(() => {
    updateIsNextStepButtonDisabled();
  }, [currentFormStepId]);

  const handleStepNext = () => {
    setCurrentFormStepId((prevFormStep) => prevFormStep + 1);
  };

  const handleStepBack = () => {
    setCurrentFormStepId((prevFormStep) => prevFormStep - 1);
  };

  const isStepCompleted = (stepId) => {
    const step = formSteps.find((s) => s.id === stepId);
    return step.isValid;
  };

  // visibility is used to keep the space needed for the LinearProgress
  // even if it's not shown.
  const LinearProgressVisibleOrNot = styled(LinearProgress)`
    visibility: ${isLoading ? 'visible' : 'hidden'};
  `;

  return (
    <>
      <LinearProgressVisibleOrNot />
      <div style={isLoading ? { opacity: '0.6' } : {}}>
        <Stepper activeStep={currentFormStepId.id - 1} alternativeLabel>
          {formSteps.map((step) => (
            <Step key={step.id} completed={isStepCompleted(step.id)}>
              <StepLabel>
                <Translate>{step.name}</Translate>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <ChangeStepWrapper>
          <PreviousStepButton
            disabled={currentFormStepId === 1}
            onClick={handleStepBack}
          />
          <NextStepButton
            disabled={isNextStepButtonDisabled}
            onClick={handleStepNext}
            style={{ float: 'right' }}
          />
        </ChangeStepWrapper>

        <StyledDivider />

        <FormWrapper onSubmit={onSubmit}>
          <FormBody
            allAuthors={allAuthors}
            allIdentifierTypes={allIdentifierTypes}
            allLanguages={allLanguages}
            allLibraries={allLibraries}
            allMassifs={allMassifs}
            allPartOf={allPartOf}
            allRegions={allRegions}
            allSubjects={allSubjects}
            formSteps={formSteps}
            currentFormStepId={currentFormStepId}
            handleStepBack={handleStepBack}
            handleStepNext={handleStepNext}
            isNextStepButtonDisabled={isNextStepButtonDisabled}
            onStepIsValidChange={onStepIsValidChange}
          />

          {isMobileOnly && (
            <ChangeStepWrapper>
              <PreviousStepButton
                disabled={currentFormStepId === 1}
                onClick={handleStepBack}
              />
              <NextStepButton
                disabled={isNextStepButtonDisabled}
                onClick={handleStepNext}
                style={{ float: 'right' }}
              />
            </ChangeStepWrapper>
          )}

          {currentFormStepId === formSteps.length && (
            <FormControl>
              <SubmitButton
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={!isFormValid}
              >
                <Translate>Submit</Translate>
              </SubmitButton>
            </FormControl>
          )}
        </FormWrapper>
      </div>
    </>
  );
};

DocumentForm.propTypes = {
  allAuthors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      surname: PropTypes.string.isRequired,
    }),
  ).isRequired,
  allIdentifierTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
  ),
  allLanguages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  allLibraries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  allMassifs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  allRegions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  allSubjects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      subject: PropTypes.string.isRequired,
    }),
  ),
  allPartOf: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      issue: PropTypes.string,
      documenType: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }),
      partOf: PropTypes.shape({}),
    }),
  ),

  formSteps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      isValid: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default DocumentForm;
