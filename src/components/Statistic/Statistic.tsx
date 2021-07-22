import React, {useRef} from "react";
import {Column, Table, AutoSizer} from 'react-virtualized';
import {useHistory} from "react-router-dom";

import { useAppSelector } from '../../app/hooks';
import {allRentData, IMetersData, dataType} from '../../features/rentData/rentDataReducerSlice'

import 'react-virtualized/styles.css';
import './Statistic.scss'

interface IPreparedData extends IMetersData {
    waterCost?: number,
    electricityCost?: number,
    total?: number
}

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
    total: "Всего",
    edit: "Изменить",
    copy: "Копировать"
};

interface ICollumnsMap {
    [index: string] : string
}

const prepareRow = (index: number, metersData: Array<IMetersData>): IPreparedData => {
    const nonFirstMonthRent: boolean = index !== 0;
    const currentMonthData: IMetersData = metersData[index];

    return Object.keys(collumnsMap).reduce((acc: IPreparedData | any, cellType: string): IPreparedData  => {
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
            case 'edit':
            case 'copy':
                acc[cellType] = '';
                break;
            default:
                acc[cellType] = cellData;
        }

        return acc;
    }, {} as IPreparedData);
}

type rowGetterType = {
    index: number
}

interface ItablePreparedData {
    current: Array<IMetersData>
}

function copyToClipboard(text: string): void {
    navigator.clipboard
        .writeText(text)
        .catch(() => {
            alert('Не удалось скопировать данные(')
        });
}

const Statistic: React.FC = () => {
    const metersData = useAppSelector(allRentData);
    const history = useHistory();
    const tablePreparedData: ItablePreparedData  = useRef([]);

    const handleRowGetter = ({index}: rowGetterType) => {
        tablePreparedData.current[index] = prepareRow(index, metersData);
        return tablePreparedData.current[index];
    };

    const handleCopyData = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
        if (event?.target instanceof HTMLElement) {
            const index: string = event.target.dataset.index!;
            const currentMonthData: IMetersData = tablePreparedData.current[+index];
            if (+index > 0) {
                const lastMonthData: IMetersData = tablePreparedData.current[+index - 1];

                const {
                    title,
                    electricityCost, //200
                    electricityData, //15
                    electricityPrice, //40
                    gasPrice, //150
                    rentPrice, //20000
                    serviceRentPrice, //1400
                    total, //20700
                    waterCost, //350
                    waterData, //15
                    waterPrice //70
                } = currentMonthData;

                const waterDiff = waterData! - lastMonthData.waterData!;
                const electricityDiff = electricityData! - lastMonthData.electricityData!;

                const massage = `
                    ${title} 
                    вода ${waterData} - ${lastMonthData.waterData} = ${waterDiff} * ${waterPrice} = ${waterCost}
                    газ ${gasPrice}
                    свет ${electricityData} - ${lastMonthData.electricityData} = ${electricityDiff} * ${electricityPrice} = ${electricityCost}
                    квертплата ${serviceRentPrice}
                    + ${rentPrice} = ${total}
                    `;

                copyToClipboard(massage);
            }
        }
    }

    const handleEditRow = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
        if (event?.target instanceof HTMLElement) {
            const id: string = event.target.dataset.id!;
            history.push(`/edit-page/${id}`);
        }
    }

    const handleCellRenderer = (cellRenderProps: any): any => {
        switch (cellRenderProps.dataKey) {
            case 'edit':
                return <button
                    className=''
                    data-id={cellRenderProps.rowData.date}
                    onClick={handleEditRow}
                >
                    edit
                </button>
            case 'copy':
                return cellRenderProps.rowIndex ? <button
                    className='.statistic-table__cell_button'
                    data-index={cellRenderProps.rowIndex}
                    onClick={handleCopyData}
                >
                    copy
                </button> : null; //подумать о правильном отображении за 1 месяц
            default:
                return cellRenderProps.cellData;
        }
    }

    const prepareColumns = (data: ICollumnsMap) => {
        return Object.keys(data).map((key: string, i: number) => {
            const title = data[key];
            return (<Column
                key={i}
                label={title}
                dataKey={key}
                width={100}
                cellRenderer={handleCellRenderer}
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
                        rowClassName='statistic-table__row'
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