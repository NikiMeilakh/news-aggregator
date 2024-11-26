import{configureStore} from '@reduxjs/toolkit'
import preferenceReducer from "./preferenceSlice";

export default configureStore({
    reducer:{
preference: preferenceReducer,
    }
})