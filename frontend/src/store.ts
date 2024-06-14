import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from './axiosConfig';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface User {
    email: string;
    number: string;
}

interface UserState {
    users: User[];
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    loading: false,
    error: null,
};

let currentAbortController: AbortController | null = null;

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (params: { email: string; number: string }, { dispatch }) => {
        if (currentAbortController) {
            currentAbortController.abort();
        }

        currentAbortController = new AbortController();
        const queryParams: any = { email: params.email };
        if (params.number) {
            queryParams.number = params.number.replace(/-/g, '');
        }

        try {
            const response = await axiosInstance.get<User[]>('/user/search', {
                params: queryParams,
                signal: currentAbortController.signal,
            });

            return response.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                throw new Error('Operation canceled due to new request.');
            } else {
                throw error;
            }
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
                state.loading = false;
                state.users = action.payload;
                state.error = null;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.error = action.error.message || 'Error fetching users';
            });
    },
});

const store = configureStore({
    reducer: {
        users: userSlice.reducer,
    },
});

export const { setLoading } = userSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
