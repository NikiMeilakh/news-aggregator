import {useSelector} from "react-redux";
import './YourCurrentSettingsStyle.css';

function YourCurrentSettings(){
    const preferences=useSelector(state=>state.preference.preferences)
    const email=useSelector(state=>state.preference.email);
    const telegramId=useSelector(state=>state.preference.telegramId);

    return (
        <div className="user-preference">
            <h2>Your current settings</h2>

            <p><span className="label">Categories:</span></p>
            <div className="category-list">
                {preferences.categories.map((elem, index) => (
                    <div key={index} className="category-item">{elem}</div>
                ))}
            </div>

            <p><span className="label">Country:</span> {preferences.language}</p>
            <p><span className="label">Email:</span> {email}</p>
            <p><span className="label">Telegram ID:</span> {telegramId}</p>

        </div>
    )
}

export default YourCurrentSettings;