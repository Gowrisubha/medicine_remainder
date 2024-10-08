import React, { useState } from "react";
import axios from "axios"; // Import axios for making HTTP requests
import "./DetailsForm.css";

function DetailsForm() {
  const [timeOfDay, setTimeOfDay] = useState("");
  const [alarmTime, setAlarmTime] = useState("");
  const [medications, setMedications] = useState([""]);

  const handleAddMedication = () => {
    setMedications([...medications, ""]);
  };

  const handleRemoveMedication = (index) => {
    const newMedications = [...medications];
    newMedications.splice(index, 1);
    setMedications(newMedications);
  };

  const handleTimeInput = (event) => {
    const { value } = event.target;
    setAlarmTime(value);
  };

  const handleMedicationChange = (index, value) => {
    const newMedications = [...medications];
    newMedications[index] = value;
    setMedications(newMedications);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Prepare the data to be sent to the server
    const formData = {
      timeOfDay,
      alarmTime,
      medications,
    };

    try {
      // Send a POST request to the server with the form data
      const response = await axios.post("/schedule", formData);
      console.log("Form submitted successfully:", response.data);
      // Optionally, you can reset the form fields after successful submission
      setTimeOfDay("");
      setAlarmTime("");
      setMedications([""]);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="detailsForm_container">
      <div className="wrapper">
        <div className="container">
          <header className="left header">
            <div className="title-header">
              <h1 className="title text-center">Survey Form</h1>
              <p className="description text-center">
                Thank you for taking the time to help us improve the platform
              </p>
            </div>
          </header>

          <form id="survey-form" className="right" onSubmit={handleSubmit}>
            <div className="form-set">
              <label htmlFor="time-of-day" className="label">
                Time of Day
              </label>
              <select
                id="time-of-day"
                name="time-of-day"
                className="form-control"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
                required
              >
                <option disabled value="">
                  Select time of day
                </option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>

            <div className="form-set">
              <label htmlFor="alarm-time" className="label">
                Alarm Time
              </label>
              <input
                type="time"
                id="alarm-time"
                name="alarm-time"
                className="form-control"
                value={alarmTime}
                style={{ width: "130px", margin: "7px" }}
                required
                onChange={handleTimeInput}
              />
            </div>

            <div className="form-set">
              <label htmlFor="medicine-name" className="label">
                Medicine Name
              </label>
              {medications.map((medicine, index) => (
                <div key={index} className="input-wrapper">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter medicine name"
                    value={medicine}
                    onChange={(e) =>
                      handleMedicationChange(index, e.target.value)
                    }
                    required
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      className="remove-medication-btn"
                      onClick={() => handleRemoveMedication(index)}
                    >
                      -
                    </button>
                  )}
                  {index === medications.length - 1 && (
                    <button
                      type="button"
                      className="add-medication-btn"
                      onClick={handleAddMedication}
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="form-set">
              <button type="submit" className="submit-button">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DetailsForm;
