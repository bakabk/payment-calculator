import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {RootState} from "../../app/store";

const API_URL = 'http://localhost:3001/api/';

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
    isPending: boolean,
    isLoading: boolean,
    isError: boolean
}

const initialState: IRentData = {
    data: [],
    isPending: false,
    isLoading: false,
    isError: false
};

export const fetchDataAsync = createAsyncThunk(
    'fetchData',
    async () => {
        let error = 'что-то пошло не так';

        try {
            const url: string = `${API_URL}data/`;
            const result = await fetch(url, {
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

export const addDataAsync = createAsyncThunk(
    'addData',
    async (data: any) => {
        let error = 'что-то пошло не так';

        try {
            const url: string = `${API_URL}add/`;
            const result = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
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
)

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
            .addCase(addDataAsync.pending, (state) => {
                state.isPending = true;
            })
            .addCase(addDataAsync.fulfilled, (state, action) => {
                state.isPending = false;
                state.data = [];
            })
    }
})

export const {errorWithData, saveData, editData} = rentDataSlice.actions;

export const allRentData = (state: RootState) => state.rentData;

export default rentDataSlice.reducer;