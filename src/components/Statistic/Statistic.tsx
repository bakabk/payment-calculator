import React from "react";
import { FixedSizeGrid as Grid } from 'react-window';

const metersData = [
    {
        id: 0,
        title: 'за Декабрь',
        date: 0,
        lastMetersData: {
            water: 0,
            electricity: 0,
            gas: true,
            rent: true,
            serviceRent: true
        },
        currentPrice: {
            water: 70,
            electricity: 40,
            gas: 150,
            rent: 20000,
            serviceRent: 1400
        }
    }
];

type metersDataType = {
    id: number,
    title: string,
    date: number,
    lastMetersData: lastMetersDataType,
    currentPrice: currentPriceType
};

type lastMetersDataType = {
    water: number,
    electricity: number,
    gas: boolean,
    rent: boolean,
    serviceRent: boolean
}

type currentPriceType = {
    water: number,
    electricity: number,
    gas: number,
    rent: number,
    serviceRent: number
}

const defaultPrice = {
    water: 70,
    electricity: 40,
    gas: 150,
    rent: 20000,
    serviceRent: 1400
}

const collumnsMap = ['title', 'date', 'waterData', 'waterPrice',
    'electricityData', 'electricityPrice', 'gasData', 'gasPrice',
    'rentData', 'rentPrice', 'serviceRentPrice'];

type cellDataType = {
    collumn: metersDataType,
    cellType: string
}

const cellRenderData = (props: cellDataType): any => {
    const {cellType, collumn} = props;
    const {title, date} = collumn;
    const {water, electricity, gas, rent, serviceRent} = collumn.lastMetersData;
    const {water: waterPrice, electricity: electricityPrice, gas: gasPrice, rent: rentPrice, serviceRent: serviceRentPrice} = collumn.currentPrice;

    switch (cellType) {
        case 'title':
            return <div>{title}</div>
        case 'date':
            return <div>{date}</div>
        case 'waterData':
            return <div>{water}</div>
        case 'waterPrice':
            return <div>{waterPrice}</div>
        case 'electricityData':
            return <div>{electricity}</div>
        case 'electricityPrice':
            return <div>{electricityPrice}</div>
        case 'gasData':
            return <div>{gas}</div>
        case 'gasPrice':
            return <div>{gasPrice}</div>
        case 'rentData':
            return <div>{rent}</div>
        case 'rentPrice':
            return <div>{rentPrice}</div>
        case 'serviceRentPrice':
            return <div>{serviceRentPrice}</div>
        default:
            return <div>---</div>
    }
}

type CellTypes = {
    data: Array<metersDataType>
    columnIndex: number,
    rowIndex: number,
    style: Object
}

const Cell = (cellProps: CellTypes) => {
    const {columnIndex, rowIndex, style, data} = cellProps;
    const cellData: cellDataType = {
        cellType: collumnsMap[columnIndex],
        collumn: data[rowIndex]
    };

    console.log('cellData', {cellData, cellProps});
    return <div style={style}>
        {cellRenderData(cellData)}
    </div>
}

const calcColumnSize = (columns: any): number => {
    const count = Object.keys(columns).reduce((size: number, columnIndex: string): number => {
        const column = columns[columnIndex];
        if (typeof(column) !== "string" && Object.keys(column).length) {
            return size + calcColumnSize(column);
        } else {
            return size + 1;
        }
    }, 0)

    return count;
}

const Statistic: React.FC = () => {
    const size = calcColumnSize(metersData[0]);

    return <div>
        <Grid
            columnWidth={100}
            height={150}
            columnCount={size}
            rowCount={metersData.length}
            rowHeight={35}
            width={900}
            itemData={metersData}
        >
            {Cell}
        </Grid>
    </div>
}

export default Statistic;