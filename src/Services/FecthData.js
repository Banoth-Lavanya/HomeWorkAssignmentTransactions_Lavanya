import logger from '../logs/logger';

export const fetchData = async () => {
    try {
      logger.info('Fetching data...');
      const response = await fetch('../public/data.json');
      logger.info('Response received:', response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      logger.info('Data fetched:', data);
      return data;
    } catch (error) {
      logger.error('Failed to fetch data:', error);
      throw error;
    }
  };