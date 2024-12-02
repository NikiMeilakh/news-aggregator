import {useDispatch, useSelector} from "react-redux";
import {setEmail, setPreferences, setTelegramId} from "./store/preferenceSlice";
import './SetUpAggregatorStyle.css';

function SetUpAggregator() {
    const dispatch=useDispatch();

    const setUpPreference=async (e)=>{
        e.preventDefault();

        const form = e.target;

        const selectedCategories = Array.from(form.querySelectorAll("input[type='checkbox']:checked")).map(
            (checkbox) => checkbox.value
        );

        const selectedLanguage = form.elements.language.value;

        await dispatch(setPreferences({
            categories: selectedCategories,
            language: selectedLanguage,
        }));
        const email=form.elements.email.value
        const telegramId=form.elements.telegramId.value;
        await dispatch(setTelegramId(telegramId))
        await dispatch(setEmail(email));
        if(selectedCategories.length===0){
            selectedCategories.push("general");
        }

            const body = JSON.stringify({ email, selectedCategories, selectedLanguage, telegramId });
            console.log(body)

            try {
                const response = await fetch('http://localhost:3001/manager', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: body
                });
                const data= await response.json();
                console.log(data);
                if (!response.ok) {
                    alert(data.message)
                    throw new Error('Network response was not ok');
                }
                else{alert("You data was successfully saved, waiting for your email:)")}
            } catch (error) {
                console.error('Fetch error:', error);
            }

    }

    return(
        <div className="news-aggregator">
            <h1>Hello! It's your news aggregator</h1>
            <form name="myPreference" onSubmit={setUpPreference}>
                <p>Select category you are interested in:</p>

                <div className="checkbox-group">
                    <div className="checkbox-item">
                        <input type="checkbox" id="business" name="business" value="business"/>
                        <label htmlFor="business">Business</label>
                    </div>
                    <div className="checkbox-item">
                        <input type="checkbox" id="entertainment" name="entertainment" value="entertainment"/>
                        <label htmlFor="entertainment">Entertainment</label>
                    </div>
                    <div className="checkbox-item">
                        <input type="checkbox" id="general" name="general" value="general"/>
                        <label htmlFor="general">General</label>
                    </div>
                    <div className="checkbox-item">
                        <input type="checkbox" id="health" name="health" value="health"/>
                        <label htmlFor="health">Health</label>
                    </div>
                    <div className="checkbox-item">
                        <input type="checkbox" id="science" name="science" value="science"/>
                        <label htmlFor="science">Science</label>
                    </div>
                    <div className="checkbox-item">
                        <input type="checkbox" id="sports" name="sports" value="sports"/>
                        <label htmlFor="sports">Sports</label>
                    </div>
                    <div className="checkbox-item">
                        <input type="checkbox" id="technology" name="technology" value="technology"/>
                        <label htmlFor="technology">Technology</label>
                    </div>
                </div>

                <label htmlFor="language-select">Country</label>
                <select name="language" id="language-select" required={true}>
                    <option value="" disabled={true}>Select country</option>
                    <option value="us">USA</option>
                    <option value="il">Israel</option>
                    <option value="ru">Russia</option>
                    <option value="de">Germany</option>
                    <option value="gb">England</option>
                </select>

                <label htmlFor="email">Enter your email:</label>
                <input type="email" id="email" name="email" required/>

                <div className={"label-with-info"}>
                <label htmlFor="telegramId">Enter your telegram ID(optional):</label>
                    <span
                        style={{
                            cursor: "pointer"
                        }}
                        title="Telegram ID is your unique identifier in Telegram. Just send a message to @userinfobot in telegram and you'll get your id in the response message!"
                    >
        ℹ️
    </span>
        </div>
                <input type="number" id="telegramId" name="telegramId"/>

                <button type="submit">Get my news!</button>
            </form>
        </div>
    )
}

export default SetUpAggregator;