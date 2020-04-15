/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import DescriptionIcon from '@material-ui/icons/Description';
import {
  Button,
  Card,
  CircularProgress,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';

import { CSVDownload } from 'react-csv';
import _ from 'lodash';

import Translate from '../../common/Translate';

import SearchTableActions from './SearchTableActions';
import { detailPageV2Links } from '../../../conf/Config';

const StyledTableFooter = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: ${({ theme }) => theme.spacing(2)}px;
`;

const styles = () => ({
  resultsContainer: {
    marginTop: '24px',
  },
  table: {
    marginBottom: 0,
    overflow: 'auto',
  },
  textError: {
    color: '#ff3333',
  },
});

const DEFAULT_FROM = 0;
const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 10;
// Don't authorize anyone to download all the database in CSV
const MAX_NUMBER_OF_DATA_TO_EXPORT_IN_CSV = 10000;

const HeaderIcon = styled.img`
  height: 3.6rem;
  vertical-align: middle;
  width: 3.6rem;
`;

// ============= MAIN COMPONENT ============= //

class SearchResultsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      from: DEFAULT_FROM,
      page: DEFAULT_PAGE,
      size: DEFAULT_SIZE,
    };
    this.entriesTableHead = this.entriesTableHead.bind(this);
    this.groupsTableHead = this.groupsTableHead.bind(this);
    this.massifsTableHead = this.massifsTableHead.bind(this);
    this.bbsTableHead = this.bbsTableHead.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.loadCSVData = this.loadCSVData.bind(this);
    this.getFullResultsAsCSV = this.getFullResultsAsCSV.bind(this);
  }

  // ============================== //

  // If the results are empty, the component must get back to the initial pagination state.
  componentDidUpdate = () => {
    const { results } = this.props;
    const { from, page, size } = this.state;

    if (
      !results &&
      (from !== DEFAULT_FROM || page !== DEFAULT_PAGE || size !== DEFAULT_SIZE)
    ) {
      this.setState({
        from: DEFAULT_FROM,
        page: DEFAULT_PAGE,
        size: DEFAULT_SIZE,
      });
    }
  };

  // ===== Table headers ===== //
  entriesTableHead = () => {
    const { intl } = this.context;
    return (
      <TableHead>
        <TableRow>
          <TableCell color="inherit">
            <Translate>Name</Translate>
          </TableCell>
          <TableCell>
            <Translate>Country</Translate>
          </TableCell>
          <TableCell>
            <Translate>Massif name</Translate>
          </TableCell>
          <TableCell>
            <Translate>Aesthetic</Translate>
          </TableCell>
          <TableCell>
            <Translate>Ease of move</Translate>
          </TableCell>
          <TableCell>
            <Translate>Ease of reach</Translate>
          </TableCell>
          <TableCell>
            <Translate>Network name</Translate>
          </TableCell>
          <TableCell>
            <HeaderIcon
              src="/images/length.svg"
              title={intl.formatMessage({
                id: 'Cave length',
                defaultMessage: 'Cave length',
              })}
              alt="Cave length icon"
            />
          </TableCell>
          <TableCell>
            <HeaderIcon
              src="/images/depth.svg"
              title={intl.formatMessage({
                id: 'Cave depth',
                defaultMessage: 'Cave depth',
              })}
              alt="Cave depth icon"
            />
          </TableCell>
        </TableRow>
      </TableHead>
    );
  };

  groupsTableHead = () => {
    const { intl } = this.context;
    return (
      <TableHead>
        <TableRow>
          <TableCell>
            <Translate>Name</Translate>
          </TableCell>
          <TableCell>
            <Translate>Contact</Translate>
          </TableCell>
          <TableCell>
            <Translate>City</Translate>
          </TableCell>
          <TableCell>
            <Translate>County</Translate>
          </TableCell>
          <TableCell>
            <Translate>Region</Translate>
          </TableCell>
          <TableCell>
            <Translate>Country</Translate>
          </TableCell>
          <TableCell>
            <HeaderIcon
              src="/images/caver-cluster.svg"
              title={intl.formatMessage({
                id: 'Number of cavers',
                defaultMessage: 'Number of cavers',
              })}
              alt="Cavers icon"
            />
          </TableCell>
        </TableRow>
      </TableHead>
    );
  };

  massifsTableHead = () => {
    const { intl } = this.context;
    return (
      <TableHead>
        <TableRow>
          <TableCell>
            <Translate>Name</Translate>
          </TableCell>
          <TableCell>
            <HeaderIcon
              src="/images/entry-cluster.svg"
              title={intl.formatMessage({
                id: 'Number of caves',
                defaultMessage: 'Number of caves',
              })}
              alt="Caves icon"
            />
          </TableCell>
          <TableCell>
            <HeaderIcon
              src="/images/gc-entries.svg"
              title={intl.formatMessage({
                id: 'Number of entries',
                defaultMessage: 'Number of entries',
              })}
              alt="Entries icon"
            />
          </TableCell>
        </TableRow>
      </TableHead>
    );
  };

  bbsTableHead = () => (
    <TableHead>
      <TableRow>
        <TableCell>
          <Translate>Title</Translate>
        </TableCell>
        <TableCell>
          <Translate>Published in</Translate>
        </TableCell>
        <TableCell>
          <Translate>Subtheme</Translate>
        </TableCell>
        <TableCell>
          <Translate>Country or region</Translate>
        </TableCell>
        <TableCell>
          <Translate>Authors</Translate>
        </TableCell>
        <TableCell>
          <Translate>Year</Translate>
        </TableCell>
      </TableRow>
    </TableHead>
  );

  // ===== Handle functions ===== //

  handleRowClick = (id) => {
    const { resourceType } = this.props;

    if (resourceType === 'entries') {
      const externalLink = `${
        detailPageV2Links[locale] !== undefined
          ? detailPageV2Links[locale]
          : detailPageV2Links['*']
      }&category=entry&id=${id}`; //eslint-disable-line
      window.open(externalLink, '_blank');
    }

    if (resourceType === 'grottos') window.open(`/ui/groups/${id}`, '_blank');
    if (resourceType === 'massifs') window.open(`/ui/massifs/${id}`, '_blank');
    if (resourceType === 'bbs') window.open(`/ui/bbs/${id}`, '_blank');
  };

  handleChangePage = (event, newPage) => {
    const { results, getNewResults, totalNbResults } = this.props;

    const { from, size } = this.state;

    // Formula: From = Page * Size (size remains the same here)
    const newFrom = newPage * size;

    /* Load new results if not enough already loaded:
      - click next page
      - results.length < totalNbResults (not ALL results already loaded)
      - results.length < newFrom + size (results on the asked page are not loaded)
    */
    if (
      newFrom > from &&
      results.length < totalNbResults &&
      results.length < newFrom + size
    ) {
      getNewResults(newFrom, size);
    }

    this.setState({
      page: newPage,
      from: newFrom,
    });
  };

  handleChangeRowsPerPage = (event) => {
    const { results, getNewResults, totalNbResults } = this.props;
    const { from } = this.state;

    /*
      Formula used here:
        Page = From / Size

      Size is changing here so we need to calculate the new page and the new from.
    */
    const newSize = event.target.value;
    const newPage = Math.trunc(from / newSize);
    const newFrom = newPage * newSize;

    /* Load new results if not enough already loaded:
      - results.length < totalNbResults (not ALL results already loaded)
      - results.length < newFrom + newSize (not enough results loaded)
    */
    if (results.length < totalNbResults && results.length < newFrom + newSize) {
      getNewResults(newFrom, newSize);
    }

    this.setState({
      from: newFrom,
      page: newPage,
      size: newSize,
    });
  };

  // ===== CSV Export
  loadCSVData = () => {
    const { getFullResults } = this.props;
    getFullResults();
  };

  getFullResultsAsCSV = () => {
    const { resourceType, fullResults } = this.props;
    const cleanedResults = fullResults;
    switch (resourceType) {
      case 'entries':
        // Flatten cave and massif
        for (let result of cleanedResults) {
          result.cave = result.cave.name;
          result.massif = result.massif.name;
          delete result['type'];
          delete result['highlights'];
        }
        break;

      case 'grottos':
        // Flatten cavers and entries
        for (let result of cleanedResults) {
          result.cavers = result.cavers.map((c) => c.nickname);
          result.entries = result.entries.map((e) => e.name);
          delete result['type'];
          delete result['highlights'];
        }
        break;

      case 'massifs':
        // Flatten caves and entries
        for (let result of cleanedResults) {
          result.caves = result.caves.map((c) => c.name);
          result.entries = result.entries.map((e) => e.name);
          delete result['type'];
          delete result['highlights'];
        }
        break;

      case 'bbs':
        // Flatten countries and subthemes
        for (let result of cleanedResults) {
          if (result.country) {
            result.countryCode = result.country.id;
            result.country = result.country.name;
          }
          if (result.subtheme) {
            result.subthemeId = result.subtheme.id;
            result.subtheme = result.subtheme.name;
          }
          delete result['type'];
          delete result['highlights'];
        }
        break;

      default:
    }

    return cleanedResults;
  };

  // ===== Render ===== //

  render() {
    const {
      classes,
      isLoading,
      results,
      resourceType,
      totalNbResults,
      isLoadingFullData,
      wantToDownloadCSV,
      fullResults,
    } = this.props;
    const { from, page, size } = this.state;
    const { intl } = this.context;

    let ResultsTableHead;
    if (resourceType === 'entries') ResultsTableHead = this.entriesTableHead;
    if (resourceType === 'grottos') ResultsTableHead = this.groupsTableHead;
    if (resourceType === 'massifs') ResultsTableHead = this.massifsTableHead;
    if (resourceType === 'bbs') ResultsTableHead = this.bbsTableHead;

    const canDownloadDataAsCSV =
      totalNbResults < MAX_NUMBER_OF_DATA_TO_EXPORT_IN_CSV;
    /*
      When the component is loading the new page, we want to keep the
      previous results displayed (instead of a white board).
      That's why we check if the slice asked by the user is returning more
      than 0 results: if not, we keep the old results.
    */
    let resultsSliced = results;
    if (resultsSliced) {
      resultsSliced = results.slice(from, from + size);
      if (resultsSliced.length === 0) {
        resultsSliced = results.slice(results.length - size, results.length);
      }
    }

    /* For small screens, change the display property to allow horizontal scroll.
      Screen smaller than 1200px AND results type not "massif"
        => scrollable table (display: "block")
      (for massif, no scroll needed because the results are not very large)
    */
    const tableDisplayValueForScroll =
      window.innerWidth < 1200 && resourceType !== 'massifs'
        ? 'block'
        : 'table';

    return resultsSliced !== undefined && resourceType !== '' ? (
      <Card className={classes.resultsContainer}>
        {resultsSliced.length > 0 ? (
          <>
            <Table
              className={classes.table}
              size="small"
              style={{ display: tableDisplayValueForScroll }}
            >
              <ResultsTableHead />

              <TableBody
                style={{
                  opacity: isLoading ? 0.3 : 1,
                }}
              >
                {resultsSliced.map((result) => (
                  <TableRow
                    hover
                    key={result.id}
                    className={classes.tableRow}
                    onClick={() => this.handleRowClick(result.id)}
                  >
                    {resourceType === 'entries' && (
                      <>
                        <TableCell>{result.name}</TableCell>
                        <TableCell>
                          {result.country ? result.country : '-'}
                        </TableCell>
                        <TableCell>
                          {result.massif.name ? result.massif.name : '-'}
                        </TableCell>
                        <TableCell>
                          {result.aestheticism
                            ? Number(result.aestheticism.toFixed(1))
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {result.caving
                            ? Number(result.caving.toFixed(1))
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {result.approach
                            ? Number(result.approach.toFixed(1))
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {result.cave.name ? result.cave.name : '-'}
                        </TableCell>
                        <TableCell>
                          {result.cave.length ? `${result.cave.length}m` : '-'}
                        </TableCell>
                        <TableCell>
                          {result.cave.depth ? `${result.cave.depth}m` : '-'}
                        </TableCell>
                      </>
                    )}
                    {resourceType === 'grottos' && (
                      <>
                        <TableCell>{result.name}</TableCell>
                        <TableCell>
                          {result.contact ? result.contact : '-'}
                        </TableCell>
                        <TableCell>{result.city ? result.city : '-'}</TableCell>
                        <TableCell>
                          {result.county ? result.county : '-'}
                        </TableCell>
                        <TableCell>
                          {result.region ? result.region : '-'}
                        </TableCell>
                        <TableCell>
                          {result.country ? result.country : '-'}
                        </TableCell>
                        <TableCell>
                          {result.cavers ? result.cavers.length : '0'}
                        </TableCell>
                      </>
                    )}
                    {resourceType === 'massifs' && (
                      <>
                        <TableCell>{result.name}</TableCell>
                        <TableCell>
                          {result.caves ? result.caves.length : '0'}
                        </TableCell>
                        <TableCell>
                          {result.entries ? result.entries.length : '0'}
                        </TableCell>
                      </>
                    )}
                    {resourceType === 'bbs' && (
                      <>
                        <TableCell>{result.title}</TableCell>
                        <TableCell>
                          {result.publication ? result.publication : '-'}
                        </TableCell>
                        <TableCell>
                          {result.subtheme ? result.subtheme.id : '-'}
                        </TableCell>
                        <TableCell>
                          {result.country
                            ? _.truncate(result.country.name, 30)
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {result.authors ? result.authors : '-'}
                        </TableCell>
                        <TableCell>{result.year ? result.year : '-'}</TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <StyledTableFooter>
              <Button
                disabled={!canDownloadDataAsCSV}
                type="button"
                variant="contained"
                size="large"
                onClick={this.loadCSVData}
                startIcon={<DescriptionIcon />}
              >
                <Translate>Export to CSV</Translate>
              </Button>

              {!isLoadingFullData &&
              fullResults.length === totalNbResults &&
              wantToDownloadCSV ? (
                <CSVDownload data={this.getFullResultsAsCSV()} target="_self" />
              ) : (
                ''
              )}

              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={totalNbResults}
                rowsPerPage={size}
                page={page}
                labelRowsPerPage={intl.formatMessage({
                  id: 'Results per page',
                })}
                onChangePage={(event, pageNb) =>
                  this.handleChangePage(event, pageNb)
                }
                onChangeRowsPerPage={(event) =>
                  this.handleChangeRowsPerPage(event)
                }
                ActionsComponent={() => (
                  <SearchTableActions
                    page={page}
                    size={size}
                    onChangePage={this.handleChangePage}
                    count={totalNbResults}
                  />
                )}
              />
            </StyledTableFooter>

            {isLoadingFullData ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress style={{ marginRight: '5px' }} />
                <Translate>Loading full data, please wait...</Translate>
              </div>
            ) : (
              ''
            )}
            {!canDownloadDataAsCSV ? (
              <>
                <p className={classes.textError}>
                  <Translate
                    id="Too many results to download ({0}). You can only download {1} results at once."
                    defaultMessage="Too many results to download ({0}). You can only download {1} results at once."
                    values={{
                      0: <b>{totalNbResults}</b>,
                      1: <b>{MAX_NUMBER_OF_DATA_TO_EXPORT_IN_CSV}</b>,
                    }}
                  />
                </p>
              </>
            ) : (
              ''
            )}
          </>
        ) : (
          <Translate>No results</Translate>
        )}
      </Card>
    ) : (
      ''
    );
  }
}

SearchResultsTable.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isLoadingFullData: PropTypes.bool.isRequired,
  results: PropTypes.arrayOf(PropTypes.shape({})),
  resourceType: PropTypes.oneOf(['', 'entries', 'grottos', 'massifs', 'bbs'])
    .isRequired,
  getNewResults: PropTypes.func.isRequired,
  getFullResults: PropTypes.func.isRequired,
  wantToDownloadCSV: PropTypes.bool.isRequired,
  totalNbResults: PropTypes.number.isRequired,
  fullResults: PropTypes.arrayOf(PropTypes.shape({})),
};

SearchResultsTable.defaultProps = {
  results: undefined,
  fullResults: undefined,
};

SearchResultsTable.contextTypes = {
  intl: PropTypes.shape({}).isRequired,
};

export default withRouter(withStyles(styles)(SearchResultsTable));
