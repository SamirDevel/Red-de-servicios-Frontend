import { createSlice } from "@reduxjs/toolkit";

const loadModalSlice = createSlice({
    name:'loadSlice',
    initialState:{
        loading:false
    },
    reducers:{
        loading:function(state){
            state.loading = true;
        },
        done:function(state){
            state.loading = false;
        }
    }
})

export const {loading, done} = loadModalSlice.actions;
export default loadModalSlice.reducer;