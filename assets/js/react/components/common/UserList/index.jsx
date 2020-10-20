import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import Table from '../Table';
import { createColumns } from '../Table/TableHead';

// ==========
const defaultHiddenColumns = ['groups'];
const customCellRenders = [
  {
    id: 'id',
    customRender: (id) => id,
  },
  {
    id: 'nickname',
    customRender: (nickname) => nickname,
  },
  {
    id: 'surname',
    customRender: (surname) => surname,
  },
  {
    id: 'name',
    customRender: (name) => name,
  },
  {
    id: 'mail',
    customRender: (mail) => mail,
  },
];

// =====

/**
 * In this component, the custom GC Table is used without multiple pages
 * and it's offline.
 * It assumes that all users are already loaded and they will not be updated.
 */
const UserList = ({ isLoading, title, userList }) => {
  const { formatMessage } = useIntl();

  const makeTranslation = (id) => {
    if (id === 'name') return formatMessage({ id: 'Caver.Name' });
    return formatMessage({ id: `${id[0].toUpperCase()}${id.slice(1)}` });
  };
  const [columns, setColumns] = useState(
    createColumns(userList, makeTranslation),
  );
  const [hiddenColumns, setHiddenColumns] = useState(defaultHiddenColumns);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id');

  useEffect(() => {
    setColumns(createColumns(userList, makeTranslation));
  }, [userList]);

  const userListOrdered = userList.sort((u1, u2) => {
    if (order === 'asc') {
      return u1[orderBy] > u2[orderBy];
    }
    return u1[orderBy] < u2[orderBy];
  });

  return (
    <Table
      columns={columns}
      customCellRenders={customCellRenders}
      data={userListOrdered || []}
      hiddenColumns={hiddenColumns}
      loading={isLoading}
      order={order}
      orderBy={orderBy}
      rowsCount={userListOrdered.length}
      rowsPerPage={userListOrdered.length}
      selection={[]}
      title={title}
      updateHiddenColumns={setHiddenColumns}
      updateOrder={setOrder}
      updateOrderBy={setOrderBy}
    />
  );
};

UserList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  userList: PropTypes.arrayOf(PropTypes.any).isRequired,
};
export default UserList;
