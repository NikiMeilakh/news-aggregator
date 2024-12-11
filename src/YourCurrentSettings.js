import {useSelector} from "react-redux";
import './YourCurrentSettingsStyle.css';
import {useEffect} from "react";

function YourCurrentSettings(){
    const preferences=useSelector(state=>state.preference.preferences)
    const email=useSelector(state=>state.preference.email);
    const telegramId=useSelector(state=>state.preference.telegramId);

    useEffect(() => {
        if (preferences.language) {
            localStorage.setItem('localCountry', JSON.stringify({country: preferences.language}));
        }
        if(preferences.categories.length>0) {
            localStorage.setItem('localCategories', JSON.stringify({categories: preferences.categories}));
        }
        if (email) {
            localStorage.setItem('localEmail', JSON.stringify({email: email}));
        }
        if (telegramId) {
            localStorage.setItem('localTelegramId', JSON.stringify({telegramId: telegramId}));
        }
    }, [preferences.language, preferences.categories, email, telegramId]);

    const cashCategories=JSON.parse(localStorage.getItem('localCategories'))||{categories:[" "]};
    const cashCountry=JSON.parse(localStorage.getItem('localCountry'))||{country: " "}
    const cashEmail=JSON.parse(localStorage.getItem('localEmail'))||{email: " "}
    const cashTelegramId=JSON.parse(localStorage.getItem('localTelegramId'))|| { telegramId: ' ' };

    return (
        <div className="user-preference">
            <h2>Your current settings</h2>

            <p><span className="label">Categories:</span></p>
            <div className="category-list">
                {(preferences.categories && preferences.categories.length > 0
                    ? preferences.categories
                    : cashCategories.categories).map((elem, index) => (
                    <div key={index} className="category-item">{elem}</div>
                ))}
            </div>

            <p><span className="label">Country:</span> {preferences.language||cashCountry.country}</p>
            <p><span className="label">Email:</span> {email||cashEmail.email}</p>
            <p><span className="label">Telegram ID:</span> {telegramId||cashTelegramId.telegramId}</p>

        </div>
    )
}

export default YourCurrentSettings;