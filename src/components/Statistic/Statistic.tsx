import React from "react";
import {Column, Table, AutoSizer} from 'react-virtualized';

import { useAppSelector } from '../../app/hooks';
import {allRentData, IMetersData, dataType} from '../../features/rentData/rentDataReducerSlice'

import 'react-virtualized/styles.css';
import './Statistic.scss'

interface IPreparedData extends IMetersData {
    waterCost?: number,
    electricityCost?: number,
    total?: number
}

//добавить кнопки
// изменения
//копировать расчет

const collumnsMap = {
    title: "Описание",
    date: "Дата",
    waterData: "Показания воды",
    waterPrice: "Стоимость куба",
    waterCost: "Итого за воду",
    electricityData: "Показания электричества",
    electricityPrice: "Стоимость 1квт",
    electricityCost: "Итого за эл",
    gasPrice: "Стоимость газа",
    rentPrice: "Аренда",
    serviceRentPrice: "Ком услуги",
    total: "Всего"
};

interface ICollumnsMap {
    [index: string] : string
}

const prepareRow = (index: number, metersData: Array<IMetersData>): IPreparedData => {
    const nonFirstMonthRent: boolean = index !== 0;
    const currentMonthData: IMetersData = metersData[index];

    const newRow = Object.keys(collumnsMap).reduce((acc: IPreparedData, cellType: string): IPreparedData  => {
        const cellData: dataType = currentMonthData[cellType];

        switch (cellType) {
            case 'waterCost':
                let waterDiff: number =  0;

                if (nonFirstMonthRent) {
                    const lastMonthData: IMetersData = metersData[index - 1];
                    waterDiff = currentMonthData.waterData! - lastMonthData.waterData!;
                }

                acc[cellType] = waterDiff * acc.waterPrice!;
                break;
            case 'electricityCost':
                let electricityDiff: number = 0;

                if (nonFirstMonthRent) {
                    const lastMonthData: IMetersData = metersData[index - 1];
                    electricityDiff = currentMonthData!.electricityData - lastMonthData.electricityData
                }
                acc[cellType] = electricityDiff * acc.electricityPrice!;
                break;
            case 'total':
                acc[cellType] = acc.waterCost! + acc.electricityCost! + acc.gasPrice! + acc.rentPrice!;
                break;
            default:
                acc[cellType] = cellData;
        }

        return acc;
    }, {} as IPreparedData);

    return newRow;
}

type rowGetterType = {
    index: number
}

const Statistic: React.FC = () => {
    const metersData = useAppSelector(allRentData);

    const handleRowGetter = ({index}: rowGetterType) => {
        return prepareRow(index, metersData);
    };

    const prepareColumns = (data: ICollumnsMap) => {
        return Object.keys(data).map((key: string, i: number) => {
            const title = data[key];
            return (<Column
                key={i}
                label={title}
                dataKey={key}
                width={100}
            />)
        })
    }

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
                        {prepareColumns(collumnsMap)}
                    </Table>
                )}
            </AutoSizer>
        </div>
    </div>
}

export default Statistic;