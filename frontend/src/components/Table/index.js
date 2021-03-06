import styled from 'styled-components';

const Table = styled.table`
  margin-top: 24px;
  width: 100%;
  background: #fff;
  padding: 30px;
  border-radius: 4px;
  text-align: center;

  th:nth-child(1),
  td:nth-child(1) {
    text-align: left;
  }

  thead {
    tr {
      th {
        font-size: 16px;
        font-weight: bold;
        color: #444;
      }
    }
  }

  tbody {
    .options {
      text-align: center;
      display: flex;
      justify-content: space-evenly;
    }

    tr {
      td {
        font-size: 16px;
        color: #666;
        padding-top: 16px;
        padding-bottom: 16px;
        margin-bottom: 16px;
        border-bottom: 1px solid #eee;
      }

      &:last-child {
        td {
          border-bottom: none;
          padding-bottom: 0;
        }
      }
    }
  }
`;

export default Table;
