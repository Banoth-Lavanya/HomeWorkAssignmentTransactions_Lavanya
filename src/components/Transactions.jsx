import React, { useState, useMemo } from 'react';
import '../App.css';
import { Sort } from '@mui/icons-material';
import { sortData, filterData, paginateData } from '../utils/SortFilterPagination';

const Transactions = ({ transactions }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  const sortedTransactions = useMemo(() => sortData(transactions, sortConfig), [transactions, sortConfig]);
  const filteredTransactions = useMemo(() => filterData(sortedTransactions, filter), [sortedTransactions, filter]);
  const { currentItems, totalPages } = useMemo(() => paginateData(filteredTransactions, currentPage, itemsPerPage), [filteredTransactions, currentPage, itemsPerPage]);

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };
  
  return (
    <div className='DataTable'>
      <input
        type="text"
        placeholder="Filter"
        value={filter}
        className='FilterData'
        onChange={e => setFilter(e.target.value)}
      />
      <table>
        <thead>
          <tr>
          <th><div className='thead-display'>Transaction ID<span onClick={() => requestSort('transaction_id')}><Sort/></span></div></th>
          <th><div className='thead-display'>Customer Name<span onClick={() => requestSort('customer_name')}><Sort/></span></div></th>
          <th><div className='thead-display'>Customer ID<span onClick={() => requestSort('customer_id')}><Sort/></span></div></th>
           <th><div className='thead-display'>Purchased Product<span onClick={() => requestSort('purchased_product')}><Sort/></span></div></th>
           <th><div className='thead-display'>Purchased Date<span onClick={() => requestSort('purchased_date')}><Sort/></span></div></th>
           <th><div className='thead-display'>Price<span onClick={() => requestSort('price')}><Sort/></span></div></th>
          <th><div className='thead-display'>Reward Points<span onClick={() => requestSort('reward_points')}><Sort/></span></div></th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
               <td>{item.transaction_id}</td>
              <td>{item.customer_id}</td>
              <td>{item.customer_name}</td>
              <td>{item.purchased_product}</td>
              <td>{item.purchased_date}</td>
              <td>{item.price}</td>
              <td>{item.reward_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
      <div className='inner-pagination'>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Transactions;