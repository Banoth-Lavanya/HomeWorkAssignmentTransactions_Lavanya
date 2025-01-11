import React, { useState, useMemo } from 'react';
import '../App.css';
import { Sort } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { ITEMS_PER_PAGE, SORT_CONFIG, CURRENT_PAGE } from '../config/constants';
import { sortData, filterData, paginateData } from '../utils/SortFilterPagination';
import { format } from 'date-fns';

/**
 * TransactionsComponent displays a list of transactions.
 *
 * @component
 * @example
 * const transactions = [
 *   {
 *     transaction_id: "TXN001",
 *     customer_name: "Lavanya",
 *     customer_id: "C00001",
 *     purchased_product: "Tablet",
 *     purchased_date: "2024-09-14",
 *     price: "379.51",
 *     reward_points: 100
 *   },
 *   // more transactions
 * ];
 * return <Transactions transactions={transactions} />;
 */

const Transactions = ({ transactions }) => {

  const [sortConfig, setSortConfig] = useState(SORT_CONFIG);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(CURRENT_PAGE);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);

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
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };

    return format(date, `d'${suffix(day)}' MMM, yyyy`);
}
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
      <table className='equal-width-table  centerAlign'>
        <thead>
          <tr>
          <th><div className='thead-display'><span>Transaction ID</span><span onClick={() => requestSort('transaction_id')}><Sort/></span></div></th>
          <th><div className='thead-display'><span>Customer Name</span><span onClick={() => requestSort('customer_name')}><Sort/></span></div></th>
          <th><div className='thead-display'><span>Customer ID</span><span onClick={() => requestSort('customer_id')}><Sort/></span></div></th>
           <th><div className='thead-display'><span>Purchased Product</span><span onClick={() => requestSort('purchased_product')}><Sort/></span></div></th>
           <th><div className='thead-display'><span>Purchased Date</span><span onClick={() => requestSort('purchased_date')}><Sort/></span></div></th>
           <th className='rightAlign'><div className='thead-display'><span>Price</span><span onClick={() => requestSort('price')}><Sort/></span></div></th>
          <th className='rightAlign'><div className='thead-display'><span>Reward Points</span><span onClick={() => requestSort('reward_points')}><Sort/></span></div></th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
               <td>{item.transaction_id}</td>
              <td>{item.customer_id}</td>
              <td>{item.customer_name}</td>
              <td>{item.purchased_product}</td>
              <td>{formatDate(item.purchased_date)}</td>
              <td className='rightAlign'>{item.price}</td>
              <td className='rightAlign'>{item.reward_points}</td>
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

Transactions.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      transaction_id: PropTypes.string.isRequired,
      customer_name: PropTypes.string.isRequired,
      customer_id: PropTypes.string.isRequired,
      purchased_product: PropTypes.string.isRequired,
      purchased_date: PropTypes.string.isRequired,
      price: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]).isRequired,
      reward_points: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Transactions;
