import React from 'react';
import '../App.css';
import './Calendar.css';

const getStatusColor = (status) => {
    switch (status) {
        case "Pencil Booked":
            return "#D9D9D9";
        case "Complete Requirements":
            return "#A6C4FF";
        case "For Assessing":
            return "#FFB951";
        case "Approved":
            return "#B3FFA6";
        default:
            return "#FFFFFF"; 
    }
};

const Event = ({ eventID, status }) => {
    return (
        <div className="event" style={{backgroundColor: getStatusColor(status)}}>
            <h4>{eventID}</h4>
        </div>
    );
}

const DayContainer = ({ day, eventID }) => {
    return (
        <div className="day-container">
            <div className="day-title">
                <h3>{day}</h3>
            </div>
            <div className="day-content">
                <div className="event-id">
                    <Event eventID={eventID} status="Pencil Booked" />
                </div>
            </div>
        </div>
    );
}

function Calendar() {
    return (
        <div className="Calendar">
            <div className="venue-titles">
                <div className="venue-name">
                    <h2>Multipurpose Hall</h2>
                </div>
                <div className="venue-name">
                    <h2>Amphitheater</h2>
                </div>
                <div className="venue-name">
                    <h2>E-Library</h2>
                </div>
                <div className="venue-name">
                    <h2>Multimedia Room</h2>
                </div>
                <div className="venue-name">
                    <h2>PE Area</h2>
                </div>
            </div>
            <div className="venue-calendar">
                <div className="week-container">
                    <div className="column one">
                        <div className="day-title">
                            <h3>SUNDAY</h3>
                        </div>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>
                    </div>
                    <div className="column two">
                        <div className="day-title">
                            <h3>MONDAY</h3>
                        </div>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>
                    </div>
                    <div className="column three">
                        <div className="day-title">
                            <h3>TUESDAY</h3>
                        </div>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>                    </div>
                    <div className="column four">
                        <div className="day-title">
                            <h3>WEDNESDAY</h3>
                        </div>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>                    </div>
                    <div className="column five">
                        <div className="day-title">
                            <h3>THURSDAY</h3>
                        </div>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>                    </div>
                    <div className="column six">
                        <div className="day-title">
                            <h3>FRIDAY</h3>
                        </div>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>                    </div>
                    <div className="column seven">
                        <div className="day-title">
                            <h3>SATURDAY</h3>
                        </div>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>
                        <DayContainer day="1" eventID="FACI001"/>                    </div>
                    
                    
                </div>
            </div>
        </div>
    );
}

export default Calendar;