import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UsersList } from '../../imports/types';
import { RootState } from '../rootRoducer';

interface UsersState {
    users: UsersList['users'];
    isLoading: boolean;
    error: string | null;
}
const initialState: UsersState = {
    users: [],
    isLoading: false,
    error: null,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers: (state: UsersState, action: PayloadAction<UsersList[]>) => {
            state.users = action.payload;
        },
        setIsLoading: (state: UsersState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        }
    }
})

export const { setUsers, setIsLoading } = usersSlice.actions;
export default usersSlice.reducer;