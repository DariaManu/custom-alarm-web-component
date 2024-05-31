# custom-alarm-web-component

## Description
The custom-alarm-web-component is and HTML component for managing alarms set by users.
The component allows users to:
- View the current time (hour, minute, second) displayed on a digital clock at the top
of the component
- Add alarms at custom times
- Enable and disable the created alarms
- Remove alarms
- Alarms will sound when the clock hits the time of the alarm

## Implementation Overview

- To create the custom component, the CustomAlarm class was created, which extends 
HTMLElement, and then the tag for this component was registered using the define function 
of the customElements object.
- The HTML structure and CSS styling of the alarm component were defined using a template element.
- The <i>connectedCallback</i> function defines the class attributes (values or other HTML elements), and
adds event listeners to the input and button elements.
- To allow people to change the sound of the alarm, the <i>observedAttributes</i> static 
function returns that the attribute "alarm-sound" should trigger a component update. The
attributeChangedCallback receives the new value assigned to the "alarm-sound" attribute,
and updates the alarm sound of the component.
- The function <i>updateTimerAndCheckAlarms</i> is called at an interval of 1 second int order to update
the clock element with the current time, and check the list of alarms.
- When the <i>Add Alarm</i> button is clicked, the <i>Create Alarm</i> function is called and 
a new alarm element is added to the component.
- A newly added alarm is by default disabled.
- Each alarm can be enabled/disabled/deleted by clicking on the corresponding icons next 
to the alarm's time.
- The functions responsible for handling these events are <i>activateAlarm</i>
<i>disableAlarm</i> and <i>deleteAlarm</i>.

## Installation
In order to use this custom component, you have to download and add to your project the
following files:
- custom-alarm.js - this file contains the definition and implementation of the 
custom web component
- alarm.mp3 - this is the default sound of the alarm; make sure to include this file in
the same directory as the custom-alarm.js file

Also, the component uses an icon for the delete button from [Font Awesome](https://fontawesome.com/),
so you need to include the following link in the "head" section of your index.html file if you 
want this icon to show on your page.

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"/>
```

## Usage
The custom alarm web component functions as any other tradition HTML tag. Once you add the tag to 
your page, the component will be rendered. To include the component in your project, add a script 
tag containing the path to the "custom-alarm.js" file. Here is a full example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Custom Alarm Web Component</title>
    <script src="./custom-alarm.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"/>
</head>
<body>
    <custom-alarm></custom-alarm>
</body>
</html>
```

You can also change the sound of the alarm by adding the "alarm-sound" attribute in the 
component's tag. Just make sure that you specify the correct path to the new alarm sound.
Below is an example:
```html
<custom-alarm alarm-sound="iphone_alarm.mp3"></custom-alarm>
```