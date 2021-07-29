import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

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

interface IRentData {
    data: Array<IMetersData>,
    isLoading: boolean,
    isError: boolean
}

const initialState: IRentData = {
    data: [
        // {
        //     id: 1620361397791,
        //     title: 'за Май',
        //     date: 1620361397791,
        //     waterData: 10,
        //     waterPrice: 70,
        //     electricityData: 10,
        //     electricityPrice: 40,
        //     gasPrice: 150,
        //     rentPrice: 20000,
        //     serviceRentPrice: 1400
        // },
        // {
        //     id: 1626361397791,
        //     title: 'за Июль',
        //     date: 1626361397791,
        //     waterData: 15,
        //     waterPrice: 70,
        //     electricityData: 15,
        //     electricityPrice: 40,
        //     gasPrice: 150,
        //     rentPrice: 20000,
        //     serviceRentPrice: 1400
        // }
    ],
    isLoading: false,
    isError: false
};

export const fetchDataAsync = createAsyncThunk(
    'fetchData',
    async () => {
        let error = 'что-то пошло не так';

        try {
            const url: string = 'http://localhost:3001/api/data/';
            const result = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (result.ok) {
                const json = await result.json();
                return json;
            } else {
                return {error};
            }
        } catch (err) {
            return {error};
        }
    }
);

export const rentDataSlice = createSlice({
    name: 'rentData',
    initialState,
    reducers: {
        errorWithData: (state, action) => {
            state.isLoading = false;
            state.isError = true;
        },
        saveData: (state: IRentData, action: PayloadAction<any>) => {
            state.isLoading = false;
            state.data = [...action.payload];
        },
        addData: (state: IRentData, action: PayloadAction<IMetersData>) => {
            state.data.push(action.payload);
        },
        editData: (state: IRentData, action: PayloadAction<IMetersData>) => {
            const elementId = state.data.reduce((result: null | number, monthRent: IMetersData, i: number) => {
                if (result !== null) return result;
                return action.payload.id === monthRent.id ? i : null;
            }, null);

            if (elementId !== null) {
                state.data[elementId] = action.payload;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDataAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchDataAsync.fulfilled, (state, action) => {
                state.isLoading = false;

                if (action.payload.error) {
                    state.isError = true;
                } else {
                    state.data = action.payload;
                }
            })
    }
})

export const {errorWithData, saveData, addData, editData} = rentDataSlice.actions;

export const allRentData = (state: RootState) => state.rentData;

export default rentDataSlice.reducer;