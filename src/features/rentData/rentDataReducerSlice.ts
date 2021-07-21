import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {RootState} from "../../app/store";

export type dataType = string | number | undefined | Date;

export interface IMetersData {
    [index: string]: dataType,
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
}

const initialState: Array<IMetersData> = [
    {
        id: 1620361397791,
        title: 'за Май',
        date: 1620361397791,
        waterData: 10,
        waterPrice: 70,
        electricityData: 10,
        electricityPrice: 40,
        gasPrice: 150,
        rentPrice: 20000,
        serviceRentPrice: 1400
    },
    {
        id: 1626361397791,
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

export const rentDataSlice = createSlice({
    name: 'rentData',
    initialState,
    reducers: {
        addData: (state, action: PayloadAction<IMetersData>) => {
            state.push(action.payload);
        },
        editData: (state, action: PayloadAction<IMetersData>) => {
            const elementId = state.reduce((result: null | number, monthRent: IMetersData, i: number) => {
                if (result !== null) return result;
                    return action.payload.id === monthRent.id ? i : null;
            }, null);

            if (elementId !== null) {
                state[elementId] = action.payload;
            }
        }
    }
})

export const { addData, editData } = rentDataSlice.actions;

export const allRentData = (state: RootState) => state.rentData;

export default rentDataSlice.reducer;