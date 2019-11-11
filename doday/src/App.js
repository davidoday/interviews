import React, { Component } from 'react'
import './App.css';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { getPatientInfo } from './Api'
import PatientInfo from './PatientInfo'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      patientID: '',
      patientInfo: null,
      isLoading: true,
      error: false
    }

    this.searchID = this.searchID.bind(this)
  }
  updateID(value) {
    this.setState({patientID: value})
  }

  searchID() {
    this.setState({isLoading: true})
    getPatientInfo(this.state.patientID)
      .then((response) => {
        this.setState({isLoading: false, patientInfo: response.data})
      })
      .catch((error) => {
        this.setState({error: true})
      })
  }
render() {
  const {patientInfo, patientID, error} = this.state
    return (
      <div className="App">
        <h1>SMART on FHIR Coding Challenge</h1>
        <h3>Please enter a patient ID.</h3>
        <TextField
            id="outlined-basic"
            label="Patient ID"
            margin="normal"
            variant="outlined"
            onChange={(e) => this.updateID(e.target.value)}
          />
        <Button variant="contained" onClick={this.searchID} style={{margin: '25px'}}>
          Search
        </Button>
        {!this.state.isLoading && <PatientInfo patientInfo={patientInfo} patientID={patientID}/>}
        {error && <div>There was an error with your request. Please try again.</div>}
      </div>
    );
  }
}

export default App;
