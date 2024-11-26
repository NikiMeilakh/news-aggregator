import {useSelector} from "react-redux";
import './YourCurrentSettingsStyle.css';

function YourCurrentSettings(){
    const preferences=useSelector(state=>state.preference.preferences)
    const email=useSelector(state=>state.preference.email);

    return (
        <div className="user-preference">
            <h2>Your current settings</h2>

            <p><span className="label">Categories:</span></p>
            <div className="category-list">
                {preferences.categories.map((elem, index) => (
                    <div key={index} className="category-item">{elem}</div>
                ))}
            </div>

            <p><span className="label">Language:</span> {preferences.language}</p>
            <p><span className="label">Email:</span> {email}</p>
        </div>
    )
}

export default YourCurrentSettings;