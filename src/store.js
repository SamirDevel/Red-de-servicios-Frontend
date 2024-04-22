import { configureStore } from "@reduxjs/toolkit";
import LoadModalReducer from "./LoadModalSlice";

const store = configureStore({
    reducer:{
        loadModal:LoadModalReducer
    }
})

export default store;