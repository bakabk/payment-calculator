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

type fetchPropsType = {
    apiPath: string
    apiMethod?: string,
    data?: any
}

const fetchData = async (props: fetchPropsType): Promise<any> => {
    const {apiPath, apiMethod, data} = props;
    const method = apiMethod || 'GET';
    let error = 'что-то пошло не так';

    try {
        const url: string = `${API_URL}${apiPath}`;
        const fData: RequestInit = {
            method,
            headers: {'Content-Type': 'application/json'}
        };

        if (data) fData.body = JSON.stringify(data);

        const result = await fetch(url, fData);

        if (result.ok) {
            return await result.json();
        } else {
            return {error};
        }
    } catch (err) {
        return {error};
    }
}

export const fetchDataAsync = createAsyncThunk(
    'fetchData',
    async () => fetchData({apiPath: 'data'})
);

//DELETE
//PATCH

export const addDataAsync = createAsyncThunk(
    'addData',
    async (data: IMetersData) => fetchData({apiPath: 'add', apiMethod: 'POST', data})
)

export const rentDataSlice = createSlice({
    name: 'rentData',
    initialState,
    reducers: {
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

                if (action.payload) {
                    state.data = action.payload;
                } else {
                    state.isError = true;
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

export const {editData} = rentDataSlice.actions;

export const allRentData = (state: RootState) => state.rentData;

export default rentDataSlice.reducer;