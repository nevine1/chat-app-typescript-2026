import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import rootReducer, { RootState } from './rootReducer';

export const store = configureStore({
    reducer: rootReducer,
    // Middleware configuration can go here if you need to ignore socket.io non-serializable checks
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Useful if you accidentally pass socket instances or dates in actions
                ignoredActions: ['socket/connect'],
            },
        }),
});

// Infer the AppDispatch type from the store
export type AppDispatch = typeof store.dispatch;

// Use these pre-typed hooks throughout your app instead of plain useDispatch and useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;