const templateCustomAlarm = document.createElement('template');
templateCustomAlarm.innerHTML = `
    <style>
        .hide {
            display: none;
        }
        
        .wrapper {
            background-color: #ffffff;
            width: 90%;
            max-width: 31.25em;
            padding: 3.12em 5em;
            position: absolute;
            transform: translateX(-50%);
            left: 50%;
            top: 1em;
            border-radius: 0.5em;
        }
        
        .timer-display {
            font-size: 2.18em;
            text-align: center;
            font-family: monospace;
        }
        
        .inputs {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1em;
            margin-top: 2em;
        }
        
        .inputs input {
            width: 2.8em;
            font-size: 1.3em;
            border: 1px solid #000000;
            border-radius: 0.3em;
            padding: 0.4em 0.2em;
        }
        
        #set {
            background-color: #377dff;
            border: none;
            padding: 0.9em 1.8em;
            display: block;
            margin: 1.5em auto 0 auto;
            border-radius: 2em;
            color: #ffffff;
            cursor:pointer;
        }
        
        .alarm {
            display: grid;
            grid-template-columns: 8fr 2fr 2fr;
            gap: 1em;
            margin-top: 1.5em;
            align-items: center;
            border-bottom: 1px solid #898f9b;
            padding-bottom: 0.6em;
        }
        
        .alarm input[type="checkbox"] {
            appearance: none;
            height: 2em;
            width: 3.5em;
            background-color: #e2e2ec;
            border-radius: 1.25em;
            position: relative;
            cursor: pointer;
            outline: none;
        }
        
        .alarm input[type="checkbox"]:before {
            position: absolute;
            content: "";
           background-color: #757683;
           height: 1.43em;
           width: 1.43em;
           border-radius: 50%;
           top: 0.25em;
           left: 0.25em
        }
        
        .alarm input[type="checkbox"]:checked {
            background-color: #d2e2ff;
        }
        
        .alarm input[type="checkbox"]:checked:before {
            background-color: #377dff;
            left: 2em;
        }
        
        .deleteButton {
            background-color: transparent;
            font-size: 1.5em;
            color: #377dff;
            border: none;
            cursor:pointer;
        }
    </style>
    
    <div class="wrapper">
        <div class="timer-display">00:00:00</div>
        <div class="container">
            <div class="inputs">
                <input type="number" id="hourInput" placeholder="00" min="0" max="23"/>
                <input type="number" id="minuteInput" placeholder="00" min="0" max="59"/>
            </div>
            <button id="set">Add Alarm</button>
        </div>
        <div class="activeAlarms">
            
        </div>
    </div>
    `;
class CustomAlarm extends HTMLElement {
    constructor() {
        super();

        this.alarmSound = new Audio("alarm.mp3");
    }

    connectedCallback() {
        this.appendChild((templateCustomAlarm.content.cloneNode(true)));
        //define class attributes
        this.timerRef = this.querySelector(".timer-display");
        this.hourInput = this.querySelector("#hourInput");
        this.minuteInput = this.querySelector("#minuteInput");
        this.activeAlarms = this.querySelector(".activeAlarms");
        this.addAlarmButton = this.querySelector("#set");

        this.alarmsArray = [];
        this.initialHour = 0;
        this.initialMinute = 0;
        this.alarmIndex = 0;

        this.hourInput.value = this.appendZero(this.initialHour);
        this.minuteInput.value = this.appendZero(this.initialMinute);

        //add event listeners to inputs and buttons
        this.hourInput.addEventListener("input", () => {
            this.hourInput.value = this.inputCheck(this.hourInput.value);
        });
        this.minuteInput.addEventListener("input", () => {
            this.minuteInput.value = this.inputCheck(this.minuteInput.value);
        })
        this.addAlarmButton.addEventListener("click", () => {
            this.alarmIndex += 1;
            //alarm object
            let alarmObj = {};
            alarmObj.id = `${this.alarmIndex}_${this.hourInput.value}_${this.minuteInput.value}`;
            alarmObj.alarmHour = this.hourInput.value;
            alarmObj.alarmMinute = this.minuteInput.value;
            alarmObj.isActive = false;
            this.alarmsArray.push(alarmObj);
            this.createAlarm(this, alarmObj);
            this.hourInput.value = this.appendZero(this.initialHour);
            this.minuteInput.value = this.appendZero(this.initialMinute);
        })

        //update clock component with current time
        setInterval(this.updateTimerAndCheckAlarms, 1000, this);
    }

    static get observedAttributes() {
        return ["alarm-sound"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "alarm-sound") {
            this.alarmSound = new Audio(newValue);
        }
    }

    //append zeroes for single digit values
    appendZero(value) {
         return value < 10 ? "0" + value : value;
    }

    //search for value in object
    searchObject(parameter, value) {
        let alarmObject, objIndex, exists = false;
        this.alarmsArray.forEach((alarm, index) => {
            if (alarm[parameter] == value) {
                exists = true;
                alarmObject = alarm;
                objIndex = index;
                return false;
            }
        });
        return [exists, alarmObject, objIndex];
    }

    //update clock time and check for alarms that should go off
    updateTimerAndCheckAlarms(component) {
        let date = new Date();
        let [hours, minutes, seconds] = [
            component.appendZero(date.getHours()),
            component.appendZero(date.getMinutes()),
            component.appendZero(date.getSeconds()),
        ];
        //display current time
        component.timerRef.innerHTML = `${hours}:${minutes}:${seconds}`;

        //check alarms
        component.alarmsArray.forEach((alarm, index) => {
            if (alarm.isActive) {
                if (`${alarm.alarmHour}:${alarm.alarmMinute}` === `${hours}:${minutes}`) {
                    component.alarmSound.play();
                    component.alarmSound.loop = true;
                }
            }
        });
    }

    inputCheck(inputValue) {
        inputValue = parseInt(inputValue);
        if (inputValue < 10) {
            inputValue = this.appendZero(inputValue);
        }
        return inputValue;
    }

    //create alarm div
    createAlarm(component, alarmObject) {
        //keys from object
        const {id, alarmHour, alarmMinute} = alarmObject;

        //alarm div
        let alarmDiv = document.createElement("div");
        alarmDiv.classList.add("alarm");
        alarmDiv.setAttribute("data-id", id);
        alarmDiv.innerHTML = `<span>${alarmHour}:${alarmMinute}</span>`;

        //checkbox
        let checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.addEventListener("click", (e) => {
           if (e.target.checked) {
               component.activateAlarm(e);
           } else {
               component.disableAlarm(e);
           }
        });
        alarmDiv.appendChild(checkbox);

        //delete button
        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteButton.classList.add("deleteButton");
        deleteButton.addEventListener("click", (e) => component.deleteAlarm(e));
        alarmDiv.appendChild(deleteButton);

        //add alarm div to alarms div
        component.activeAlarms.appendChild(alarmDiv);
    }

    //activate an alarm
    activateAlarm(e) {
        let searchId = e.target.parentElement.getAttribute("data-id");
        let [exists, obj, index] = this.searchObject("id", searchId);
        if (exists) {
            this.alarmsArray[index].isActive = true;
        }
    }

    //disable an alarm
    disableAlarm(e) {
        let searchId = e.target.parentElement.getAttribute("data-id");
        let [exists, obj, index] = this.searchObject("id", searchId);
        if (exists) {
            this.alarmsArray[index].isActive = false;
            this.alarmSound.pause();
        }
    }

    //delete an alarm
    deleteAlarm(e) {
        let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
        let [exists, obj, index] = this.searchObject("id", searchId);
        if (exists) {
            e.target.parentElement.parentElement.remove();
            this.alarmsArray.splice(index, 1);
        }
    }
}

customElements.define("custom-alarm", CustomAlarm);