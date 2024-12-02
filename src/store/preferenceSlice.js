import {createSlice} from "@reduxjs/toolkit";

const preferenceSlice=createSlice({
    name:'news',

    initialState:{
        preferences:{
            categories: [],
            language: ''
        },
        email: '',
        telegramId:'',
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
        setTelegramId(state,action){
            state.telegramId=action.payload;
        }
    }
})
 export const{setPreferences,setEmail,
 setTelegramId}=preferenceSlice.actions;
export default preferenceSlice.reducer;