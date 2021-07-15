import React from "react";
import {Column, Table, AutoSizer} from 'react-virtualized';

import 'react-virtualized/styles.css'; // only needs to be imported once
import './Statistic.scss'

interface IMetersData {
    id?: number,
    title?: string,
    date?: number,
    waterData?: number,
    waterPrice?: number,
    electricityData: number,
    electricityPrice?: number,
    gasPrice?: number,
    rentPrice?: number,
    serviceRentPrice?: number,
};

const metersData: Array<IMetersData> = [
    {
        id: 0,
        title: 'за Май',
        date: 1620301397791,
        waterData: 10,
        waterPrice: 70,
        electricityData: 10,
        electricityPrice: 40,
        gasPrice: 150,
        rentPrice: 20000,
        serviceRentPrice: 1400
    },
    {
        id: 1,
        title: 'за Июль',
        date: 1626361397791,
        waterData: 15,
        waterPrice: 70,
        electricityData: 15,
        electricityPrice: 40,
        gasPrice: 150,
        rentPrice: 20000,
        serviceRentPrice: 1400
    }
];

const collumnsMap = [
    'title', 'date',
    'waterData', 'waterPrice', 'waterCost',
    'electricityData', 'electricityPrice', 'electricityCost',
    'gasPrice',
    'rentPrice',
    'serviceRentPrice',
    'total'
];

interface IPreparedData extends IMetersData {
    [index: string]: string | number | undefined,
    waterCost?: number,
    electricityCost?: number,
    total?: number
}

const prepareRow = (index: number): any => {
    const nonFirstMonthRent: boolean = index !== 0;
    const row: any = metersData[index];

    const newRow = collumnsMap.reduce((acc: IPreparedData, cellType: string): IPreparedData  => {
        const cellData: number | string = row[cellType] || null;

        switch (cellType) {
            case 'waterCost':
                let waterDiff: number =  0;

                if (nonFirstMonthRent) {
                    const lastMonthData: IMetersData = metersData[index - 1];
                    waterDiff = row.waterData - lastMonthData.waterData!;
                }

                acc[cellType] = waterDiff * acc.waterPrice!;
                break;
            case 'electricityCost':
                let electricityDiff: number = 0;

                if (nonFirstMonthRent) {
                    const lastMonthData: IMetersData = metersData[index - 1];
                    electricityDiff = row!.electricityData - lastMonthData.electricityData
                }
                acc[cellType] = electricityDiff * acc.electricityPrice!;
                break;
            case 'total':
                acc[cellType] = acc.waterCost! + acc.electricityCost! + acc.gasPrice! + acc.rentPrice!;
                break;
            default:
                acc[cellType] = cellData;
        }

        // console.log(`i - ${index}`, {cellType, cellData, row, lastMonthData, acc});
        return acc;
    }, {} as IPreparedData);

    console.log({newRow});

    return newRow;
}

type rowGetterType = {
    index: number
}

const Statistic: React.FC = () => {
    const handleRowGetter = ({index}: rowGetterType) => {
        return prepareRow(index);
    };

    return <div className='statistic-table'>
        <div className='statistic-table__wrapper'>
            <AutoSizer>
                {({width, height}) => (
                    <Table
                        disableHeader={false}
                        width={width}
                        height={height}
                        headerHeight={20}
                        rowHeight={30}
                        headerClassName='statistic-table__header'
                        rowClassName='statistic-table__cell'
                        rowCount={metersData.length}
                        rowGetter={handleRowGetter}
                    >
                        <Column
                            label="Описание"
                            dataKey="title"
                            width={100}
                        />
                        <Column
                            width={100}
                            label="Дата"
                            dataKey="date"
                        />
                        <Column
                            width={100}
                            label="Показания воды"
                            dataKey="waterData"
                        />
                        <Column
                            width={100}
                            label="Стоимость куба"
                            dataKey="waterPrice"
                        />
                        <Column
                            width={100}
                            label="Итого за воду"
                            dataKey="waterCost"
                        />
                        <Column
                            width={100}
                            label="Показания электричества"
                            dataKey="electricityData"
                        />
                        <Column
                            width={100}
                            label="Стоимость 1квт"
                            dataKey="electricityPrice"
                        />
                        <Column
                            width={100}
                            label="Итого за эл"
                            dataKey="electricityCost"
                        />
                        <Column
                            width={100}
                            label="Стоимость газа"
                            dataKey="gasPrice"
                        />
                        <Column
                            width={100}
                            label="Аренда"
                            dataKey="rentPrice"
                        />
                        <Column
                            width={100}
                            label="Ком услуги"
                            dataKey="serviceRentPrice"
                        />
                        <Column
                            width={100}
                            label="Всего"
                            dataKey="total"
                        />
                    </Table>
                )}
            </AutoSizer>
        </div>
    </div>
}

export default Statistic;