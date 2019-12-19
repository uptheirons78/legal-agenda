import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

const Table = ({ keyField, data, columns }) => (
  <BootstrapTable
    keyField={keyField}
    data={data}
    columns={columns}
    striped
    hover
    condensed
  />
);

export default Table;
