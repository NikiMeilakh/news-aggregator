import {createSlice} from "@reduxjs/toolkit";

const preferenceSlice=createSlice({
    name:'news',

    initialState:{
        preferences:{
            categories: [],
            language: ''
        },
        email: '',
    },

    reducers:{
        setPreferences(state,action){
state.preferences={
    categories: [...action.payload.categories],
    language: action.payload.language
}
        },
        setEmail(state,action){
            state.email=action.payload
        },
    }
})
 export const{setPreferences,setEmail}=preferenceSlice.actions;
export default preferenceSlice.reducer;