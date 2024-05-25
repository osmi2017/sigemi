import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import DataTable from 'react-data-table-component';
import '../../../scss/main.scss';

const Table = ({ isOnline, apiIsOnline, data, columns }) => {
  console.log(data);
  return (
    <>
      {isOnline && apiIsOnline ? (
        data.length > 0 ? (
          <div className="datatable-container">
            <DataTable
              columns={columns}
              data={data}
              pagination
            />
          </div>
        ) : (
          <SkeletonTheme baseColor="" highlightColor="">
            <div className="skeleton-container">
              {/* Display Skeleton for each row in the table */}
              <Skeleton count={10} height={25} />
            </div>
          </SkeletonTheme>
        )
      ) : (
        <SkeletonTheme baseColor="" highlightColor="">
          <div className="offline-message">
            
            {apiIsOnline
              ? 'You are offline. Please check your internet connection.'
              : (
                <div className="skeleton-container ">
                <div className="row ">
                  {/* Display Skeleton for circle avatar and text */}
                  <div className="col-md-3 skeleton-circle">
                    <Skeleton circle={true} height={30} width={30} count={10} />
                  </div>
                  <div className="col-md-6 skeleton-bar">
                    <Skeleton count={10} height={30} width={500}/>
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
