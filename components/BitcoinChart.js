import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { format } from 'date-fns';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const BitcoinChart = () => {
    const [bitcoinData, setBitcoinData] = useState([]);
  
    useEffect(() => {
      const fetchBitcoinData = async () => {
        try {
          const response = await axios.get(
            'https://api.coindesk.com/v1/bpi/historical/close.json'
          );
          setBitcoinData(response.data.bpi);
        } catch (error) {
          console.error('Error fetching Bitcoin data:', error);
        }
      };
  
      fetchBitcoinData();
    }, []);
  
    const dates = Object.keys(bitcoinData || {});
    const prices = Object.values(bitcoinData || {});
  
    const chartData = {
      options: {
        chart: {
          id: 'bitcoin-chart',
        },
        xaxis: {
          type: 'datetime',
          tooltip: {
            formatter: function (value) {
              return format(new Date(value), 'MMMM d, yyyy');
            },
          },
        },
        yaxis: {
          title: {
            text: 'Price (USD)',
          },
        },
      },
      series: [
        {
          name: 'Bitcoin Price',
          data: dates.map((date, index) => [new Date(date).getTime(), prices[index]]),
        },
      ],
    };
  
    return (
      <div>
        <h1>Bitcoin Price Chart</h1>
        {Array.isArray(bitcoinData) && bitcoinData.length > 0 ? (
          <ApexChart options={chartData.options} series={chartData.series} type="line" height={400} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  };

export default BitcoinChart;
