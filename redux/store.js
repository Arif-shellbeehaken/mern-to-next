import { configureStore } from '@reduxjs/toolkit';

import itemSlice from './slice/itemSlice';
import { shoppingApi } from './services/shoppingApi';
export const store = configureStore({
  reducer: {
    [shoppingApi.reducerPath]: shoppingApi.reducer,
    item: itemSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(shoppingApi.middleware),
});
