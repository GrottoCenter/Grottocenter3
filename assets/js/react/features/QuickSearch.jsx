import React from 'react';
import { isNil, length } from 'ramda';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import AutoCompleteSearch from '../components/common/AutoCompleteSearch';
import {
  fetchQuicksearchResult,
  setCurrentEntry,
  resetQuicksearch,
} from '../actions/Quicksearch';
import { focusOnLocation } from '../actions/Map';
import { entityOptionForSelector } from '../helpers/Entity';
import { useDebounce } from '../hooks';

const renderOption = (option) => entityOptionForSelector(option);

const getOptionLabel = (option) => option.name;

const QuickSearch = ({ ...autoCompleteProps }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { results, errors, isLoading } = useSelector(
    (state) => state.quicksearch,
  );
  const [input, setInput] = React.useState('');
  const debouncedInput = useDebounce(input);

  const handleSelection = (selection) => {
    dispatch(setCurrentEntry(selection));
    dispatch(
      focusOnLocation({
        lat: selection.latitude,
        lng: selection.longitude,
      }),
    );
    if (selection.id) {
      switch (selection.type) {
        case 'massif':
          history.push(`/ui/massifs/${encodeURIComponent(selection.id)}`);
          break;
        case 'bbs':
          history.push(`/ui/massifs/${encodeURIComponent(selection.id)}`);
          break;
        default:
          history.push('/ui/map');
      }
    }
    setInput('');
  };

  React.useEffect(() => {
    if (length(debouncedInput) > 2) {
      dispatch(
        fetchQuicksearchResult({
          query: debouncedInput.trim(),
          complete: false,
        }),
      );
    } else {
      dispatch(resetQuicksearch());
    }
  }, [debouncedInput]);

  return (
    <AutoCompleteSearch
      onInputChange={setInput}
      inputValue={input}
      // Todo: add translation
      label="Quick search"
      suggestions={results}
      onSelection={handleSelection}
      renderOption={renderOption}
      getOptionLabel={getOptionLabel}
      hasError={!isNil(errors)}
      isLoading={isLoading}
      {...autoCompleteProps}
    />
  );
};

export default QuickSearch;

QuickSearch.propTypes = {
  hasFixWidth: PropTypes.bool,
  label: PropTypes.string,
};