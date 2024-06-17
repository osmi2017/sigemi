import React, { useState, useEffect } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import DataTable from 'react-data-table-component';
import '../../../scss/main.scss';
import { useTranslation } from 'react-i18next';

const Table = ({ isOnline, apiIsOnline, data, columns }) => {
  
  const { t } = useTranslation();
  const [filteredData, setFilteredData] = useState(data);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    const lowercasedFilter = filterText.toLowerCase();
    const filtered = data.filter(item => 
      Object.keys(item).some(key =>
        String(item[key]).toLowerCase().includes(lowercasedFilter)
      )
    );
    setFilteredData(filtered);
  }, [filterText, data]);

  return (
    <>
      {isOnline && apiIsOnline ? (
        data.length > 0 ? (
          <div className="datatable-container">
            <div className="filter-container">
              <input
                type="text"
                placeholder={t('search')}
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                className="filter-input"
              />
            </div>
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
            />
          </div>
        ) : (
          <SkeletonTheme baseColor="" highlightColor="">
            <div className="skeleton-container">
              <Skeleton count={10} height={25} />
            </div>
          </SkeletonTheme>
        )
      ) : (
        <SkeletonTheme baseColor="" highlightColor="">
          <div className="offline-message">
            {apiIsOnline
              ? t('connexion')
              : (
                <div className="skeleton-container">
                  <div className="row">
                    <div className="col-md-3 skeleton-circle">
                      <Skeleton circle={true} height={30} width={30} count={10} />
                    </div>
                    <div className="col-md-6 skeleton-bar">
                      <Skeleton count={10} height={30} width={500} />
                    </div>
                  </div>
                </div>
              )}
          </div>
        </SkeletonTheme>
      )}
    </>
  );
};

export default Table;
